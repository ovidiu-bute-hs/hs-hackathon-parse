Parse.Cloud.beforeSave("Person", function(request, response) {
  query = new Parse.Query("BucharestOffice")
  return query.first({
    success: function(office) {
      const personInOffice = request.object.get('isInOffice')
      const uniqueId = request.object.get('uniqueId')

      // Sanity
      if (personInOffice === undefined || uniqueId === undefined) {
        return response.error('Person is undefined!')
      }

      // Do not decrement past 0
      if (office.get('online') <= 0 && personInOffice === false) {
        return response.error('Already at 0 people.')
      }

      // Save only if status has changed
      let personQuery = new Parse.Query("Person")
      personQuery.equalTo('uniqueId', uniqueId)
      personQuery.descending('_updated_at')
      personQuery.limit(1)
      return personQuery.first({
        success: (object) => {

          if (object === undefined) {
            if (personInOffice) {
              office.increment('online')
              return office.save(null, {
                success: (obj) => {
                  return response.success()
                },
                error: (err) => {
                  return response.error(err)
                }
              })
            } else {
              return response.error('Cannot set new person as not in office!')
            }
          } else {
            if (object.get('isInOffice') === false && personInOffice === false) {
              return response.error('Person not in office and previous status is also not in office!')
            } else if (object.get('isInOffice') === personInOffice) {
              return response.error(`Person office status is the same as previous: ${personInOffice}`)
            }

            office.increment('online', personInOffice === true ? 1 : -1)
            return office.save(null, {
              success: (obj) => {
                return response.success()
              },
              error: (err) => {
                return response.error(err)
              }
            })
          }
        },
        error: (err) => {
          console.log('11111')
          return response.error(err)
        }
      })
    },
    error: function(error) {
      console.error(`Got an error ${error.code} : ${error.message}`)
      return response.error(`Got an error ${error.code} : ${error.message}`)
    }
  })
})
