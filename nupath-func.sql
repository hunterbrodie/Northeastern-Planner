DELIMITER //

CREATE FUNCTION GetNUPathId ( ndArg BOOL, eiArg BOOL, icArg BOOL, fqArg BOOL, siArg BOOL, adArg BOOL,
    ddArg BOOL, erArg BOOL, wfArg BOOL, wiArg BOOL, wdArg BOOL, exArg BOOL, ceArg BOOL) RETURNS INT

BEGIN
    SET @fk_id = NULL;

    SELECT id INTO @fk_id FROM nupath WHERE (nd = ndArg) AND (ei = eiArg) AND (ic = icArg) AND (fq = fqArg) AND (si = siArg)
        AND (ad = adArg) AND (dd = ddArg) AND (er = erArg) AND (wf = wfArg) and (wi = wiArg) AND (wd = wdArg)
        AND (ex = exArg) AND (ce = ceArg);

    IF @fk_id IS NULL THEN
        INSERT INTO nupath (nd, ei, ic, fq, si, ad, dd, er, wf, wi, wd, ex, ce)
        VALUES (ndArg, eiArg, icArg, fqArg, siArg, adArg, ddArg, erArg, wfArg, wiArg, wdArg, exArg, ceArg);
        SET @fk_id = LAST_INSERT_ID();
    END IF;

    RETURN @fk_id;
END; //

DELIMITER ;
