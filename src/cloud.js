Parse.Cloud.afterSave("Person", function(request) {
  query = new Parse.Query("BucharestOffice")
  query.first({
    success: function(office) {
      const personInOffice = request.object.get('isInOffice')

      // Do not decrement past 0
      if (office.get('online') <= 0 && personInOffice === false) {
        return
      }

      office.increment('online', personInOffice === true ? 1 : -1)
      return office.save()
    },
    error: function(error) {
      console.error(`Got an error ${error.code} : ${error.message}`)
    }
  })
})
