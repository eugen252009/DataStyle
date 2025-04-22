# DataStyle

**A tool to transform CSS rules into SQL queries.**

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Are you a frontend developer who doesn't feel like dealing with SQL? Then I have the perfect answer to your problem!**

**Transform your CSS into SQL so you can interact with the database.**

## Querying

### Select 

```css
.table{}
```
transforms into
```sql
select * from table;
```
---

```css
.table{
id;
}
```
transforms into
```sql
select id from table;
```

---

```css
.table[attr="hello"]{
id;
data;
}
```
transforms into
```sql
select id,data from table where attr='hello';
```

### Insert


```css
.table{
 id="Hello";
 data="User";
}
```
transforms into
```sql
insert into table (id, data) values ('Hello','User');
```

### Update

```css
.table[attr="123"]{
  id="Hello";
  data="User";
}
```
transforms into
```sql
update table set id='Hello',data='User' where attr='123';
```


