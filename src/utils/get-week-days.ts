interface GetWeekDaysParams {
  shorts?: boolean
}

export function getWeekDays({ shorts = false }: GetWeekDaysParams = {}) {
  const formatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' })

  return Array.from(Array(7).keys()).map((day) =>
    formatter.format(new Date(Date.UTC(2025, 3, day)))
  ).map(weekDay => {
    if (shorts) {
      return weekDay.substring(0, 3).toUpperCase()
    }

    return weekDay.substring(0,1).toUpperCase().concat(weekDay.substring(1))
  })
}