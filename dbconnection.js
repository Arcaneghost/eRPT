var sql = require("mssql");

var dbConfig = {
    server: "PC106-4B\\SQLEXPRESS",
    database: "eRPT",
    user: "test",
    password: "testpassword",
    port: 1433
};

var exports = module.exports = {};

exports.getExample = function(req, res, next){
    var conn = new sql.Connection(dbConfig);
    var request = new sql.Request(conn);
    conn.connect(function (err) {
        if (err) {
            console.log("Error: couldn't connect to the db");
            return next();
        }
        var queryString = "SELECT * from dbo.Person where dbo.Person.person_ID = " + req.user.id;
        request.query(queryString, function (err, queryData) {
            if (err) {
                console.log(err);
                conn.close();
                return next();
            }
            else {
                res.data = queryData;
                conn.close();
                return next();
            }
        });
    });
};

exports.getBinders = function(req, res, next){
    var conn = new sql.Connection(dbConfig);
    var request = new sql.Request(conn);
    conn.connect(function (err) {
        if (err) {
            console.log("Error: couldn't connect to the db");
            return next();
        }
        request.query("SELECT * from dbo.Binder", function (err, recordset) {
            if (err) {
                console.log(err);
                conn.close();
                return next();
            }
            else {
                res.recordset = recordset;
                conn.close();
                return next();
            }
        });
    });
};

exports.getPerson = function(req, res, next){
    var conn = new sql.Connection(dbConfig);
    var request = new sql.Request(conn);
    conn.connect(function (err) {
        if (err) {
            console.log("Error: couldn't connect to the db");
            return next();
        }
        request.query("SELECT * from dbo.Person", function (err, recordset) {
            if (err) {
                console.log(err);
                conn.close();
                return next();
            }
            else {
                res.recordset = recordset;
                conn.close();
                return next();
            }
        });
    });
};

exports.uploadDoc = function(req, res, next){
    var conn = new sql.Connection(dbConfig);
    var request = new sql.Request(conn);
    conn.connect(function (err) {
        if (err) {
            console.log("Error: couldn't connect to the db");
            return next();
        }
        request.query("INSERT INTO [dbo].[Files] ( file_ID, content ) SELECT NEWID(), bulkcolumn FROM OPENROWSET(BULK 'C:/test1/samplepdf.pdf', SINGLE_BLOB) AS x SELECT * FROM dbo.files", function (err, queryData) {
            if (err) {
                console.log(err);
                conn.close();
                return next();
            }
            else {
                console.log("attempted to upload doc");
                res.file = queryData;
                conn.close();
                return next();
            }
        });
    });
};

exports.getDoc = function(req, res, next){
    var conn = new sql.Connection(dbConfig);
    var request = new sql.Request(conn);
    conn.connect(function (err) {
        if (err) {
            console.log("Error: couldn't connect to the db");
            return next();
        }
        var queryString = "SELECT content from dbo.Files WHERE file_Name = 'Group4ProjectPlanFINAL.pdf'";
        request.query(queryString, function (err, queryData) {
            if (err) {
                console.log(err);
                conn.close();
                return next();
            }
            else {
                //console.log(queryData);
                res.doc = queryData;
                conn.close();
                return next();
            }
        });
    });
};

exports.getAnno = function(req, res, next){
    var conn = new sql.Connection(dbConfig);
    var request = new sql.Request(conn);
    conn.connect(function (err) {
        if (err) {
            console.log("Error: couldn't connect to the db");
            return next();
        }
        var queryString = "SELECT annotationContent from dbo.Annotations WHERE annotation_ID = 2";
        request.query(queryString, function (err, queryData) {
            if (err) {
                console.log(err);
                conn.close();
                return next();
            }
            else {
                console.log(queryData);
                res.anno = queryData;
                conn.close();
                return next();
            }
        });
    });
};

exports.getDocAndAnno = function(req, res, next){
    var conn = new sql.Connection(dbConfig);
    var request = new sql.Request(conn);
    conn.connect(function (err) {
        if (err) {
            console.log("Error: couldn't connect to the db");
            return next();
        }
        var queryString = "SELECT content from dbo.Files WHERE file_Name = 'Group4ProjectPlanFINAL.pdf'";
        //var queryString = "SELECT annotationContent from dbo.Annotations WHERE annotation_ID = 2";
        //queryString = queryString + " UNION ALL SELECT content from dbo.Files WHERE file_Name = 'Group4ProjectPlanFINAL.pdf'";
        queryString = queryString + " UNION ALL SELECT annotationContent from dbo.Annotations WHERE annotation_ID = 2";
        request.query(queryString, function (err, queryData) {
            if (err) {
                console.log(err);
                conn.close();
                return next();
            }
            else {
                console.log(queryData);
                res.data = queryData;
                //THEN DO SECOND QUERY? LOAD RESULTS INTO DATA[1]? I'm a little confused as to why that can't or hasn't been done.
                conn.close();
                return next();
            }
        });
    });
};

exports.testerDocuments = function(req, res, next){
    var conn = new sql.Connection(dbConfig);
    var request = new sql.Request(conn);
    conn.connect(function (err) {
        if (err) {
            console.log("Error: couldn't connect to the db");
            return next();
        }
        var queryString = "SELECT File_ID from dbo.PersonBF WHERE Person_ID = " + req.user.id;
        request.query(queryString, function (err, queryData) {
            if (err) {
                console.log(err);
                conn.close();
                return next();
            }
            for(i = 0; i < queryData.length; i++) {
                queryData[i] = queryData[i].File_ID;
            }
            queryString = "SELECT content from dbo.Files WHERE File_ID = '" + queryData[0] + "'";
            for(i = 1; i < queryData.length; i++) {
                queryString = queryString + " UNION ALL SELECT content from dbo.Files WHERE File_ID = '" + queryData[i] + "'";
            }
            request.query(queryString, function (err, data) {
                if (err) {
                    console.log(err);
                    conn.close();
                    return next();
                }
                console.log(data);
                res.data = data;
                conn.close();
                return next();
            });
        });
    });
};

exports.createNewBinder = function(req, res, next){
    var conn = new sql.Connection(dbConfig);
    var request = new sql.Request(conn);
    conn.connect(function (err) {
        if (err) {
            console.log("Error: couldn't connect to the db");
            return next();
        }
        //Insert into Binder table a temp name for binder, binder_ID is auto increment
        request.query("INSERT INTO dbo.Binder(binder_Name) VALUES ('"+ req.user.username + req.user.id + "');" +
                //Insert into BinderRole table role, person_ID, binder_ID (from Binder Table)
            " INSERT INTO dbo.BinderRole(role, person_ID, binder_ID) VALUES ('Applicant', " + req.user.id +
            ", (SELECT binder_ID FROM dbo.Binder WHERE binder_Name = +'" + req.user.username + req.user.id +"'));" +
                //Update binder_Name so we can add more binders
            " UPDATE dbo.Binder SET binder_Name = '" + req.user.username + "' WHERE binder_Name = '" + req.user.username + req.user.id + "';"
            , function (err, queryData) {
                if (err) {
                    console.log(err);
                    conn.close();
                    return next();
                }
                else {
                    conn.close();
                    return next();
                }
            });
    });
};

exports.getDynamicBinder = function(req, res, next){
    var conn = new sql.Connection(dbConfig);
    var request = new sql.Request(conn);
    conn.connect(function (err) {
        if (err) {
            console.log("Error: couldn't connect to the db");
            return next();
        }
        var queryString =   "SELECT binder_Name, B.binder_ID " +
                            "FROM dbo.Binder As B " +
                            "INNER JOIN BinderRole As BR " +
                            "ON B.binder_ID = BR.binder_ID " +
                            "INNER JOIN Person As P " +
                            "ON BR.person_ID = P.person_ID " +
                            "WHERE BR.role = 'Applicant' " +
                            "AND P.person_ID = " + req.user.id;
        request.query(queryString, function (err, binders) {
            if (err) {
                console.log(err);
                conn.close();
                return next();
            }
            else {
                res.binders = binders;
                conn.close();
                return next();
            }
        });
    });
};

exports.addFileDB = function(req, res, next){
    //var conn = new sql.Connection(dbConfig);
    //var request = new sql.Request(conn);
    //conn.connect(function (err) {
    //    if (err) {
    //        console.log("Error: couldn't connect to the db");
    //        return next();
    //   }
    //    var queryString = "INSERT INTO dbo.Files(file_Name,file_Desc,file_Path,file_ID,content) VALUES (" + req.body.pdfName + ", " + req.body.pdfDesc + ", NULL, NEWID(),CONVERT(varbinary(max),'" + req.body.pdfString + "',1)";
    //    request.query(queryString, function (err) {
    //        if (err) {
    //            console.log(err);
    //            conn.close();
    //            return next();
    //        }
    //        else {
    //             conn.close();
    //           return next();
    //        }
    //    });
    //});
    return next();
};

exports.getBinderFiles = function(req, res, next){
    var conn = new sql.Connection(dbConfig);
    var request = new sql.Request(conn);
    conn.connect(function (err) {
        if (err) {
            console.log("Error: couldn't connect to the db");
            return next();
        }
        var queryString =   "SELECT DISTINCT P.person_ID, F.content,F.file_ID,F.file_Name,BF.binder_Tab " +
                            "FROM [dbo].[Person] as P " +

                            "INNER JOIN PersonBF as PBF " +
                            "ON P.person_ID = PBF.person_ID " +

                            "INNER JOIN dbo.BinderRole as BR " +
                            "ON P.person_ID = BR.person_ID " +

                            "INNER JOIN dbo.Binder as B " +
                            "ON BR.binder_ID = B.binder_ID " +

                            "INNER JOIN dbo.BinderFile as BF " +
                            "ON B.binder_ID = BF.binder_ID " +

                            "INNER JOIN dbo.Files as F " +
                            "ON BF.file_ID = F.file_ID " +

                            "WHERE B.Binder_ID = 49 " +
                            "AND P.person_ID =" + req.user.id;


                            /*"USE [eRPT] SELECT [content], F.file_ID, F.file_Name, BF.binder_Tab, P.person_ID " +
                            "FROM [dbo].[Files] As F " +
                            "INNER JOIN BinderFile As BF " +
                            "ON F.file_ID = BF.file_ID " +
                            "INNER JOIN Binder As B " +
                            "ON BF.binder_ID = B.binder_ID " +
                            "INNER JOIN BinderRole As BR " +
                            "ON B.binder_ID = BR.binder_ID " +

                            "INNER JOIN dbo.Person As P " +
                            "ON P.person_ID = BF.person_ID " +
                            "INNER JOIN PersonBF As PBF " +
                            "ON P.person_ID = PBF.person_ID " +

                            "WHERE B.Binder_ID = 49 "; +
                            "AND P.person_ID = 5";*/

        request.query(queryString, function (err, binderFiles) {
            if (err) {
                console.log(err);
                conn.close();
                return next();
            }
            else {
                res.binderFiles = binderFiles;
                conn.close();
                return next();
            }
        });
    });
};

/*
exports.getBinderFiles = function(req, res, next){
    if (req.query.binder == null) {
        return next();
    }
    var conn = new sql.Connection(dbConfig);
    var request = new sql.Request(conn);
    conn.connect(function (err) {
        if (err) {
            console.log("Error: couldn't connect to the db");
            return next();
        }
        var queryString = ""; //ask for files using req.query.binder
        request.query(queryString, function (err, queryData) {
            if (err) {
                console.log(err);
                conn.close();
                return next();
            }
            else {
                res.binderFiles = queryData;
                conn.close();
                return next();
            }
        });
    });
};
*/