import { parseInput } from "./index.cjs";
const Test = (msg: string, sqlString: string, id: number): boolean => {
	const testresult = parseInput(msg);
	if ("error" in testresult) {
		console.error(id + 1, testresult.error);
		return false
	}
	if (sqlString === testresult.result) {
		return true
	} else {
		return false
	}
}
const testCases = [
	//Select
	["normal Select", ".table{}", "select * from table;"],
	["normal Select", ".table{id;}", "select id from table;"],
	["normal Select", ".table{id=\"123\";}", "insert into table (id) values ('123');"],
	["normal Select", `.table[attr1="testdata"]{}`, `select * from table where attr1='testdata';`],
	["normal Select", `.table[attr1="testdata"]{attr1;}`, `select attr1 from table where attr1='testdata';`],
	["normal Select", `.table[attr1="testdata"]{attr1;data;}`, `select attr1,data from table where attr1='testdata';`],
	["normal Select", `.table[attr1="testdata"][data="testdata"]{attr1;data;}`, `select attr1,data from table where attr1='testdata' and data='testdata';`],
	//Insert
	["normal Insert", `.table{attr1="testdata";useragent="Test";path="test.txt";}`, `insert into table (attr1,useragent,path) values ('testdata','Test','test.txt');`],
	["normal Insert", `.table{attr1="testdata";useragent="Test";path="test.txt";}`, `insert into table (attr1,useragent,path) values ('testdata','Test','test.txt');`],
	//update
	["normal Update", '.table[attr1="testdata"]{ path="321"; }', "update table set path='321' where attr1='testdata';"],
	["normal Update", '.table[attr1="testdata"]{ path="321";useragent="hallo"; }', `update table set path='321',useragent='hallo' where attr1='testdata';`],
	//Multiline
	["normal Select", '.table{}\n.table[attr1="testdata"]{ path="321";useragent="hallo"; }', "select * from table;\nupdate table set path='321',useragent='hallo' where attr1='testdata';"],
	["normal Select", '.table{}\n.table[attr1="testdata"]{ path="321";useragent="hallo"; }', "select * from table;\nupdate table set path='321',useragent='hallo' where attr1='testdata';"],
	["normal Select", '.table[attr1="testdata"]{}\n.table[attr1="testdata"]{attr1;}', `select * from table where attr1='testdata';\nselect attr1 from table where attr1='testdata';`],
	//delete
	["Testing delete", ":delete.table{}", "delete from table;"],
	["Testing delete", ':delete.table[attr1="testdata"]{}', "delete from table where attr1='testdata';"],
];


const SummaryOfAllTests = testCases.reduce((result: boolean, test, id: number) => {
	const testresult = Test(test[1], test[2], id);
	if (!testresult) { console.error(id, test) }
	return result && testresult;
}, true);
console.log(SummaryOfAllTests ? "All Tests passed." : "Some Tests dont Passed");
