Parse.Cloud.afterSave("Person", function(request) {
  query = new Parse.Query("BucharestOffice")
  query.first({
    success: function(office) {
      const personInOffice = request.object.get('person').inOffice

      // Do not decrement past 0
      if (!office.online && !personInOffice) {
        return
      }

      office.increment('online', request.object.get('person').inOffice ? 1 : -1)
      office.save()
    },
    error: function(error) {
      console.error(`Got an error ${error.code} : ${error.message}`)
    }
  })
})
