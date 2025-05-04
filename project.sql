SELECT 
    OBJECT_NAME(parent_object_id) AS TableName,
    name AS ConstraintName,
    definition AS CheckCondition
FROM 
    sys.check_constraints
WHERE 
    parent_object_id = OBJECT_ID('Items');

--alter table Items
--drop constraint ItemIn

alter table items
add constraint ItemStatus CHECK (ItemStatus IN ('Lost', 'Found', 'Retrieved', 'Pending'))

select * from Items

