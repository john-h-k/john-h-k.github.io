# Why do I get 'column must appear in the GROUP BY clause or be used in an aggregate function'?

This is an error I see plague people new to SQL, and I find the Stack Overflow posts that come up when googling it to be pretty useless, so I thought I'd write up some help on it.

Let's query our imaginary database for all our users.

```sql
SELECT * FROM users;
```

This query, unsuprisingly, works fine and returns what we expect.

```
  id   |         email         | first_name | last_name 
-------+-----------------------+------------+-----------
 0     | veryreal@emailll.com  | Jon        | Smith
 1     | myfakeemail@email.com | John       | Kelly
(2 rows)
```

Let's now query how many users there are.

```sql
SELECT COUNT(*) FROM users;
```

Again, the expected result. All simple stuff.

```
count  
--------
 2
(1 row)
```

Now, let's select a user and all their posts.

```sql
SELECT * FROM users JOIN posts ON posts.user_id = users.id;
```

```
  id   |         email         | first_name | last_name |   post_name  | post_length
-------+-----------------------+------------+-----------+--------------+------------
 0     | veryreal@emailll.com  | Jon        | Smith     | Intro        | 10
 0     | veryreal@emailll.com  | Jon        | Smith     | Virus        | 882
 1     | myfakeemail@email.com | John       | Kelly     | My Blog      | 12645
 1     | myfakeemail@email.com | John       | Kelly     | Maths        | 100
 1     | myfakeemail@email.com | John       | Kelly     | SqlAggregate | 999
 
(3 rows)
```

As expected, we get all the posts of the user joined with the user. What about if we decide we don't actually care about the posts and just want the number of posts each user has? The obvious next step would be

```sql
SELECT users.id, COUNT(posts) FROM users JOIN posts ON posts.user_id = users.id;
```

It's here where we finally meet our dreaded error.

```
ERROR:  column "users.id" must appear in the GROUP BY clause or be used in an aggregate function
LINE 1: SELECT users.id, COUNT(posts) FROM users JOIN post...
               ^
SQL state: 42803
Character: 8
```

But why?! What on earth is wrong with our query. It sure _feels_ valid, and `COUNT` was working just a second ago...

To understand why this query doesn't actually make sense, it helps to look at a simpler example.

```sql
SELECT id, COUNT(*) FROM users;
```

Think through this query - given that we have already ran queries for the count of users and to select users already - and what you'd expect it to return. You can start to see why this query wouldn't make sense. Where would the count result go? On every record? That doesn't make sense, as it isn't part of each record. In reality, `COUNT(*)` is completely different to selecting attributes, as instead of operating on each record it is operating on the entirety of the result of the query - it is _aggregating_ the output. If you really wanted that (you almost certainly don't), it would make more sense for it just to be a subquery. It'll be optimised away by the database so would only execute once.

```sql
SELECT id, (SELECT COUNT(*) FROM users) FROM users;
```

By thinking about why the earlier query doesn't make sense, and the fact that a join just creates a record with the data from both records in the join, you can start to see why this error occurs. `SELECT users.id, COUNT(posts)` is really saying "for each record, select `users.id` and also the number of records with posts in this entire query". `users.id` applies per-row, but `COUNT(posts)` is an aggregate function and applies to the entire query result. `COUNT(*)` or even `COUNT(users)` would have the same value here, as all it actually counts is the number of rows returned by joining the two tables.

## So now I understand why my query doesn't make sense, what is the error message telling me?

If the column you're querying is also used in an aggregate function (like `COUNT`, `MIN`, `MAX`, `AVG`, and `SUM`, to name a few), the query does make sense.

```sql
SELECT MIN(id), MAX(id), COUNT(*) FROM users; -- COUNT(*) is no different from COUNT(id) here
```

While a bit nonsensical, this query makes complete sense to the database. From the entire table `users`, select the aggregates `MIN(id)`, `MAX(id)`, and `COUNT(*)`. As they are all aggregates, they don't go on an individual row and are all returned together.

```
 min | max | count  
-----+-----+--------
   0 |  1  |   2
(1 row)
```

This is the part of the error that says the row can 'be used in an aggregate function' to fix it. But what about 'appear in the GROUP BY clause'?

Well, let's quickly recap on what `GROUP BY` does. It groups sets of rows together so that they can be queried on as a, well, group. This is the other scenario where you can get the same error, without using `COUNT(*)` or a similar aggregate function

```sql
SELECT id FROM users GROUP BY first_name; -- nonsensical yes, but pretend it is valid
```

This nets us the same error as earlier, and this makes sense. How can it select `id` from a group of rows that could have many different values of `id`? If we instead select `first_name`, this works fine, because each group by definition has the same `first_name`

```sql
SELECT first_name FROM users GROUP BY first_name;
```

```
 first_name 
------------
 Jon
 John
(2 rows)
```

Now, this data isn't very useful, but you can mix in aggregate functions to learn more about these groups. This still makes sense, because each aggregate is per-_group_, which is the same scope at which `first_name` is being selected. 

```sql
SELECT first_name, COUNT(*), MIN(id), AVG(id) FROM users GROUP BY first_name;
```

```
 first_name | count | min | avg 
------------+-------+-----+-----
 Jon        |   1   |  0  | 0
 John       |   1   |  1  | 1
(2 rows)
```

Of course, still not very useful, but you get the point. This hopefully shows why a field being part of the `GROUP BY` expression allows it to be selected outside of an aggregate function, because it means that the aggregate functions are operating in the same scope as the attribute is being selected.

## Brilliant, but how do I count my user's posts!?

Of course none of this has told you the best way to actually count the number of associates from the earlier example. There are a few different ways you could go about it

### Group by

Using `GROUP BY` properly can fix your query. If you group by a primary key or a set of fields with a unique index, you can then access all of the columns on that table in your `SELECT`, as the `GROUP BY` having a unique key means that all rows will be in their own group.

```sql
SELECT users.id, COUNT(posts) FROM users JOIN posts ON posts.user_id = users.id GROUP BY users.id;
-- you can select other columns too, as you use the primary key to group
SELECT users.id, CONCAT(users.first_name, ' ', users.last_name) AS Name, COUNT(posts) FROM users JOIN posts ON posts.user_id = users.id GROUP BY users.id;
```

### Subquery

Using a subquery also works for finding the count

```sql
SELECT users.id, (SELECT COUNT(*) FROM posts WHERE posts.user_id = users.id) FROM users;
```

### Windows functions

When you have more complex queries, that involve multiple joins, often a group by is impossible and a subquery is not efficient enough. In this case, a window function (see your specific database's documentation, here I am using PostgreSQL syntax) allows you to perform an aggregate over a "set of related rows" with a lot more power than default aggregates. To quote the PostgreSQL docs:

> A window function performs a calculation across a set of table rows that are somehow related to the current row. This is comparable to the type of calculation that can be done with an aggregate function. But unlike regular aggregate functions, use of a window function does not cause rows to become grouped into a single output row — the rows retain their separate identities. Behind the scenes, the window function is able to access more than just the current row of the query result.

```sql
SELECT users.id, COUNT(posts) OVER (PARTITION BY users.id) FROM users JOIN posts ON posts.user_id = users.id GROUP BY users.id;
```

You can see how in this simple query it is effectively the same as the `GROUP BY` above. This isn't very useful here, but it can be where a `GROUP BY` isn't possible or has unwanted side effects.

