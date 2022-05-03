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
		fetch('https://api.huskyplan.com:8443/get/course/' + crn)
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
					<div className='buttons-div'>
						<button className='ghost-button-sem' onClick={this.addCourse} type="button">Add Course</button>
						<button className='ghost-button-sem' onClick={this.removeCourse} type="button">Remove Course</button>
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
		years: [],
		selectedTab: 0
	}

	constructor(props) {
		super(props);

		var blankYears = [];
		blankYears.push(<Year key='1' year='1' loadData={[]} passToParent={this.loadToParent} />);
		blankYears.push(<Year key='2' year='2' loadData={[]} passToParent={this.loadToParent} />);
		blankYears.push(<Year key='3' year='3' loadData={[]} passToParent={this.loadToParent} />);
		blankYears.push(<Year key='4' year='4' loadData={[]} passToParent={this.loadToParent} />);
		blankYears.push(<Year key='5' year='5' loadData={[]} passToParent={this.loadToParent} />);

		this.state = {
			data: [],
			years: blankYears,
			selectedTab: 0
		}
	}

	componentDidMount() {
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

	loadFile = (e) => {
		const fileInput = document.getElementById("file-input");
		fileInput.click();
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

	switchTab = (id) => {
		switch (id) {
			case 0:
				this.setState({
					data: this.state.data,
					years: this.state.years,
					selectedTab: 0
				});
				break;
			case 1:
				this.setState({
					data: this.state.data,
					years: this.state.years,
					selectedTab: 1
				});
				break;
			default:
				break;
		}
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<h2>NEU Course Planner</h2>
					<div className='buttons-div'>
						<button onClick={(e) => this.switchTab(0)} className={this.state.selectedTab === 0 ? 'tab-button-selected' : 'tab-button'}>Planner</button>
						<button onClick={(e) => this.switchTab(1)} className={this.state.selectedTab === 1 ? 'tab-button-selected' : 'tab-button'}>Course Search</button>
					</div>
				</header>
				<div className='App-data'>
					{this.state.selectedTab === 0 ? this.state.years : null}
				</div>
				<div className='App-data'>
					{this.state.selectedTab === 1 ?
						<div className='search-page'>
							<div className='search-options'>
								<h3>NUPath</h3>
								<div className='checkbox-options'>
									<div>
										<input type="checkbox" id="nd" />
										<label for="nd">ND</label><br></br>
									</div>

									<div>
										<input type="checkbox" id="ei" />
										<label for="ei">EI</label><br></br>
									</div>

									<div>
										<input type="checkbox" id="ic" />
										<label for="ic">IC</label><br></br>
									</div>
									<div>
										<input type="checkbox" id="fq" />
										<label for="fq">FQ</label><br></br>
									</div>
									<div>
										<input type="checkbox" id="si" />
										<label for="si">SI</label><br></br>
									</div>
									<div>
										<input type="checkbox" id="ad" />
										<label for="ad">AD</label><br></br>
									</div>
									<div>
										<input type="checkbox" id="dd" />
										<label for="dd">DD</label><br></br>
									</div>
									<div>
										<input type="checkbox" id="er" />
										<label for="er">ER</label><br></br>
									</div>
									<div>
										<input type="checkbox" id="wf" />
										<label for="wf">WF</label><br></br>
									</div>
									<div>
										<input type="checkbox" id="wi" />
										<label for="wi">WI</label><br></br>
									</div>
									<div>
										<input type="checkbox" id="wd" />
										<label for="wd">WD</label><br></br>
									</div>
									<div>
										<input type="checkbox" id="ex" />
										<label for="ex">EX</label><br></br>
									</div>
									<div>
										<input type="checkbox" id="ce" />
										<label for="ce">CE</label><br></br>
									</div>
								</div>
							</div>
							<div className='search-bar'>
								<h3 className='search-bar-child'>Search Courses:</h3>
								<input className='search-bar-child' type='text' />
								<button className='ghost-button-sem search-bar-child'>Search!</button>
							</div>
						</div> : null}
				</div>
				<footer className='App-footer'>
					<div className='links'>
						<h4 className='link'>
							<a href='https://hunterbrodie.com' target="_blank" rel="noreferrer">
								hunterbrodie.com
							</a>
						</h4>
						<h4 className='link'>
							<a href='https://gitlab.com/hunterbrodie/northeastern-planner' target="_blank" rel="noreferrer">
								gitlab
							</a>
						</h4>
					</div>
					<div className='buttons-div'>
						<button className='ghost-button' onClick={this.savePlan} type="button">Save Plan</button>
						<button className='ghost-button' onClick={this.loadFile} type="button">Load Plan</button>
						<input hidden id='file-input' type='file' onChange={this.loadPlan} />
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
