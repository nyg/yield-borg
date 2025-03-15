import { pgSql } from '../../db/db'


export default async function getYieldAverage(req, res) {

   const allStrategies = new Set()

   const yieldAverages = (await pgSql`
         select a.date, a.value, s.name
           from average_yields a
          inner join earn_strategies s
             on a.earn_strategy = s.id
          order by date desc`)
      .reduce((averages, average) => {

         const month = average.date.toISOString().substring(0, 7)
         averages[month] ??= { date: average.date.getTime() }
         averages[month][average.name] = average.value

         // build set of distinct strategies
         allStrategies.add(average.name)

         return averages
      }, {})

   res.status(200).json({
      yieldAverages: Object.values(yieldAverages),
      assets: [...allStrategies].sort()
   })
}
