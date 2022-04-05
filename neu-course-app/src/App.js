import './App.css';
import React from 'react';


class Row extends React.Component {
	render() {
		return (
			<div className="grid-container">
				<div className="grid-item">{this.props.crn}</div>
				<div className="grid-item">{this.props.name}</div>
				<div className="grid-item">{this.props.nupath}</div>
				<div className="grid-item">{this.props.credits}</div>
			</div>
		);
	}
}

class Semester extends React.Component {
	state = {
		rows: [],
		crns: [],
		credits: 0
	}

	constructor(props) {
		super(props);

		for (var i = 0; i < props.loadData.length; i++) {
			if (props.loadData[i].year === this.props.year && props.loadData[i].sem === this.props.semester) {
				this.fetchData(props.loadData[i].data);
			}
		}
	}

	sendDataUp = (crn, delBool) => {
		this.props.passToParent({
			year: this.props.year,
			sem: this.props.semester,
			data: crn,
		}, delBool);
	}

	getName = () => {
		switch (parseInt(this.props.semester)) {
			case 0: return this.props.year + " - Fall";
			case 1: return this.props.year + " - Spring";
			case 2: return this.props.year + " - Summer 1";
			case 3: return this.props.year + " - Summer 2";
			default: return '';
		}
	}

	addCourse = (e) => {
		const courseNumber = prompt('Course Number:');

		if (!this.state.crns.includes(courseNumber)) {
			this.fetchData(courseNumber);
		}
	}

	fetchData = (crn) => {
		fetch('/get/course/' + crn)
			.then(response => response.json())
			.then(data => this.populateCourse(data));
	}

	populateCourse = (course) => {
		if (course != null) {
			this.state.rows.push(<Row key={course.crn} crn={course.crn} name={course.name} nupath={course.nupath.toString()} credits={course.credits} />);
			this.state.crns.push(course.crn);
			this.sendDataUp(course.crn, false);
		}

		this.updateStateVars();
	}

	removeCourse = (e) => {
		const courseNumber = prompt('Course Number:');

		if (this.state.crns.includes(courseNumber)) {
			for (var i = 0; i < this.state.crns.length; i++) {
				if (this.state.crns[i] === courseNumber) {
					this.state.crns.splice(i, 1);
					this.sendDataUp(courseNumber, true);
				}
				if (this.state.rows[i].props.crn === courseNumber) {
					this.state.rows.splice(i, 1);
				}
			}
		}

		this.updateStateVars();
	}

	updateStateVars = () => {
		var totalCredits = 0;

		this.state.rows.forEach(e => totalCredits += e.props.credits);

		this.state.rows.sort((a, b) => a.props.crn.localeCompare(b.props.crn));

		this.setState({
			semester: this.state.semester,
			rows: this.state.rows,
			crns: this.state.crns,
			credits: totalCredits
		});
	}

	render() {
		return (
			<div className="flex-child">
				<div className='semester-header'>
					<h3>{this.getName()}</h3>
					<div>
						<button className='semester-header-button' onClick={this.addCourse} type="button">Add Course</button>
						<button className='semester-header-button' onClick={this.removeCourse} type="button">Remove Course</button>
					</div>
				</div>
				<div>
					<div className="grid-container">
						<div className="grid-item">CRN</div>
						<div className="grid-item">Course Name</div>
						<div className="grid-item">NUPath</div>
						<div className="grid-item">Credits</div>
					</div>
				</div>
				<div>
					{this.state.rows}
				</div>
				<div className='credit-total-container'>
					<div className='grid-item'></div>
					<div className='grid-item'>{this.state.credits}</div>
				</div>
			</div>
		)
	}
}

class Year extends React.Component {
	state = {
		data: []
	}

	render() {
		return (
			<div>
				<div className='flex-container'>
					<Semester loadData={this.props.loadData} passToParent={this.props.passToParent} year={this.props.year} semester='0' />
					<Semester loadData={this.props.loadData} passToParent={this.props.passToParent} year={this.props.year} semester='1' />
				</div>
				<div className='flex-container'>
					<Semester loadData={this.props.loadData} passToParent={this.props.passToParent} year={this.props.year} semester='2' />
					<Semester loadData={this.props.loadData} passToParent={this.props.passToParent} year={this.props.year} semester='3' />
				</div>
			</div>
		)
	}
}

class Page extends React.Component {
	state = {
		data: [],
		years: []
	}

  componentDidMount(){
    document.title = "NEU Course Planner"
  }

	instantiatePlan = (d) => {
		if (d === null) {
			d = [];
		}
		var blankYears = [];

		this.setState({
			data: [],
			years: []
		});

		blankYears.push(<Year key='1' year='1' loadData={d} passToParent={this.loadToParent} />);
		blankYears.push(<Year key='2' year='2' loadData={d} passToParent={this.loadToParent} />);
		blankYears.push(<Year key='3' year='3' loadData={d} passToParent={this.loadToParent} />);
		blankYears.push(<Year key='4' year='4' loadData={d} passToParent={this.loadToParent} />);
		blankYears.push(<Year key='5' year='5' loadData={d} passToParent={this.loadToParent} />);

		this.setState({
			data: [],
			years: blankYears
		});
	}

	loadToParent = (dat, delBool) => {
		if (delBool === true) {
			for (var i = 0; i < this.state.data.length; i++) {
				if (JSON.stringify(dat) === JSON.stringify(this.state.data[i])) {
					this.state.data.splice(i, 1);
				}
			}
		}
		else {
			if (!this.state.data.some(elem => {
				return JSON.stringify(dat) === JSON.stringify(elem);
			})) {
				this.state.data.push(dat);
			}
		}
	}

	savePlan = (e) => {
		this.saveAsJson();
	}

	loadPlan = (e) => {
		const selectedFile = e.target.files[0];

		var reader = new FileReader();
		reader.readAsText(selectedFile, "UTF-8");

		reader.onload = this.handleFileLoad;
		reader.onerror = (evt) => {
			alert("error reading file");
		};
	}

	handleFileLoad = (evt) => {
		this.instantiatePlan(JSON.parse(evt.target.result));
	};

	saveAsJson = () => {
		const element = document.createElement("a");
		const file = new Blob([JSON.stringify(this.state.data)], { type: 'application/json' });
		element.href = URL.createObjectURL(file);
		element.download = "schedule.json";
		document.body.appendChild(element); // Required for this to work in FireFox
		element.click();
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<h2>NEU Course Planner</h2>
				</header>
				<div>
					{this.state.years}
				</div>
				<footer className='App-footer'>
					<h4>hunterbrodie.com</h4>
					<div>
						<button className='semester-header-button' onClick={this.instantiatePlan} type="button">New Plan</button>
						<button className='semester-header-button' onClick={this.savePlan} type="button">Save Plan</button>
						<input className='semester-header-button' id='file-input' type='file' onChange={this.loadPlan} />
					</div>
				</footer>
			</div>
		)
	}
}

function App() {
	return (
		<Page />
	);
}

export default App;
