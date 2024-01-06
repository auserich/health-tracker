SET @ChosenDate = '2023-10-28';
SET @UserId = 1;

-- WITH DateRange AS (
--   SELECT 
--     DATE_ADD('2023-10-28', INTERVAL(1-DAYOFWEEK('2023-10-28')) DAY) AS StartOfWeek,
--     DATE_ADD('2023-10-28', INTERVAL(7-DAYOFWEEK('2023-10-28')) DAY) AS EndOfWeek
-- )
-- SELECT 
--   MIN(DateRange.StartOfWeek) AS WeekStartDate,
--   MAX(DateRange.EndOfWeek) AS WeekEndDate,
--   w.date AS DateInWeek,
--   IFNULL(SUM(w.ounces), 0) AS TotalOunces
-- FROM DateRange
-- LEFT JOIN water_log w ON w.date >= DateRange.StartOfWeek AND w.date <= DateRange.EndOfWeek
-- WHERE w.user_id = 1  -- Add this line to filter by user ID
-- GROUP BY DateInWeek
-- #ORDER BY DateInWeek; #optional

-- WITH DateRange AS (
--   SELECT 
--     DATE_ADD('2023-10-28', INTERVAL(1-DAYOFWEEK('2023-10-28')) DAY) AS StartOfWeek,
--     DATE_ADD('2023-10-28', INTERVAL(7-DAYOFWEEK('2023-10-28')) DAY) AS EndOfWeek
-- )
-- SELECT 
--   DateRange.StartOfWeek AS WeekStartDate,
--   DateRange.EndOfWeek AS WeekEndDate,
--   w.date AS DateInWeek,
--   IFNULL(SUM(w.ounces), 0) AS TotalOunces
-- FROM DateRange
-- LEFT JOIN water_log w ON w.date >= DateRange.StartOfWeek AND w.date <= DateRange.EndOfWeek
-- WHERE w.user_id = 1
-- GROUP BY DateRange.StartOfWeek, DateRange.EndOfWeek, DateInWeek

SET @ChosenDate = '2023-10-28';
SET @UserId = 1;
SELECT
    w.date AS DateInWeek,
    IFNULL(SUM(w.ounces), 0) AS TotalOunces
FROM water_log w
WHERE w.user_id = 1
    AND w.date >= DATE_SUB('2023-10-28', INTERVAL DAYOFWEEK('2023-10-28') - 1 DAY)
    AND w.date < DATE_ADD('2023-10-28', INTERVAL 7 - DAYOFWEEK('2023-10-28') DAY)
GROUP BY w.date

# test

-- WITH DateRange AS (
--             SELECT
--             DATE_ADD('2023-10-28', INTERVAL(1-DAYOFWEEK('2023-10-28')) DAY) AS StartOfWeek,
--             DATE_ADD('2023-10-28', INTERVAL(7-DAYOFWEEK('2023-10-28')) DAY) AS EndOfWeek
--             )
--             SELECT
--             MIN(DateRange.StartOfWeek) AS weekStartDate,
--             MAX(DateRange.EndOfWeek) AS weekEndDate,
--             w.date AS dateInWeek,
--             COALESCE(SUM(w.ounces), 0) AS totalOunces
--             FROM DateRange
--             LEFT JOIN water_log w ON w.date >= DateRange.StartOfWeek AND w.date <= DateRange.EndOfWeek
--             WHERE w.user_id = 1
--             GROUP BY dateInWeek
--             ORDER BY dateInWeek