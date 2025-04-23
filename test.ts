import { parseInput } from "./index";
const Test = (msg: string, sqlString: string, id: number) => {
	const testresult = parseInput(msg);
	if ("error" in testresult) {
		console.log(testresult.error);
		return
	}
	if (sqlString === testresult.result) {
		console.log(`Test ${id} passed.`);
	} else {
		console.log(`Test ${id} failed\n${testresult.result}\n${sqlString}`);
	}
}
const testCases = [
	[".table{}", "select * from table;"],
	[".table{id;}", "select id from table;"],
	[".table{id=\"123\";}", "insert into table (id) values ('123');"],
	[`.table[attr1="testdata"]{}`, `select * from table where attr1='testdata';`],
	[`.table[attr1="testdata"]{attr1;}`, `select attr1 from table where attr1='testdata';`],
	[`.table[attr1="testdata"]{attr1;data;}`, `select attr1,data from table where attr1='testdata';`],
	[`.table[attr1="testdata"][data="testdata"]{attr1;data;}`, `select attr1,data from table where attr1='testdata' and data='testdata';`],
	[`.table{attr1="testdata";useragent="Test";path="test.txt";}`, `insert into table (attr1,useragent,path) values ('testdata','Test','test.txt');`],
	['.table[attr1="testdata"]{ path="321"; }', "update table set path='321' where attr1='testdata';"],
	['.table[attr1="testdata"]{ path="321";useragent="hallo"; }', `update table set path='321',useragent='hallo' where attr1='testdata';`],
	['.table{}\n.table[attr1="testdata"]{ path="321";useragent="hallo"; }', "select * from table;\nupdate table set path='321',useragent='hallo' where attr1='testdata';"],
	['.table{}\n.table[attr1="testdata"]{ path="321";useragent="hallo"; }', "select * from table;\nupdate table set path='321',useragent='hallo' where attr1='testdata';"],
	['.table[attr1="testdata"]{}\n.table[attr1="testdata"]{attr1;}', `select * from table where attr1='testdata';\nselect attr1 from table where attr1='testdata';`],
	[":delete.table{}", "delete from table;"],
	[':delete.table[attr1="testdata"]{}', "delete from table where attr1='testdata';"],
];

for (let index = 0; index < testCases.length; index++) {
	const test = testCases[index];
	Test(test[0], test[1], index + 1);
}
