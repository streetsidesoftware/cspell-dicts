/************************************************************************************************************************************
*   Generates the code to update the collation for all affected columns in the table                                                 *
************************************************************************************************************************************/
INSERT INTO #tempscriptstore (ScriptType,
                                script)
SELECT      'AlterCollation',
            N'ALTER TABLE ' + QUOTENAME(@SchemaName) + N'.' + QUOTENAME(@TableName) + N' ALTER COLUMN '
            + QUOTENAME(c.name) + ' '
            + CASE WHEN ty.name = N'ntext'
                        THEN ty.name + N' COLLATE ' + @DatabaseCollation + ' '
                    ELSE ty.name + N'(' + CASE WHEN c.max_length = -1
                                                    THEN N'MAX'
                                                ELSE CASE WHEN ty.name = N'nvarchar'
                                                            THEN CAST(c.max_length / 2 AS nvarchar(20))
                                                        ELSE CAST(c.max_length AS nvarchar(20))
                                                    END
                                            END + N') COLLATE ' + @DatabaseCollation
                END + CASE WHEN c.is_nullable = 1 THEN N' NULL;' ELSE N' NOT NULL;' END
FROM        sys.columns AS c
INNER JOIN  sys.types   AS ty
    ON       ty.system_type_id = c.system_type_id
    AND      ty.name           <> N'sysname'
WHERE       c.object_id = @object_id
AND         c.collation_name    <> @DatabaseCollation;

-- cspell:ignore tempscriptstore
