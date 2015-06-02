Frontend spec

Routes
```
App
---/Jobs
---/Jobs/{id}
```

Components
```
Jobs
--Alert
--Manipulator
----SearchBar
----DateSelector
--Table
----TableHeaders
----TableRows
----TableCell

Single Job
--Notifier
--Details Form
----TextField
----Dropdown
--Table
----TableHeaders
----TableRows
----TableCell
--PrintButton
```

Stores
```
Jobs
SingleJob
```

Actions
```
GET_JOBS
GET_SINGLE_JOB

UPDATE_JOB_DETAILS

CREATE_SINGLE_JOB

CREATE_JOB_ITEM
DUPLICATE_JOB_ITEM

SORT_ONE
SORT_MULTIPLE

FILTER_BY

ALERT
```
