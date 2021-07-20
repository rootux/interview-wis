# Unit and Integration tests

I've divided the testing into 2 categories - 
### 1 Fast unit test
> Those include mocked objects and as their name suggest run faster

### 2. Slow integration test
> Those include setting up a test database and testing with that database.

Given more time - I would refactor most of the `Integration test` into `unit test` using some kind of a mock repository for the database
