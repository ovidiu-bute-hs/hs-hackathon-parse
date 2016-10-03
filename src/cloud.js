Parse.Cloud.afterSave("Person", function(request) {
  query = new Parse.Query("BucharestOffice")
  query.first({
    success: function(office) {
      post.increment('online', request.object.get('person').inOffice ? 1 : -1)
      post.save()
    },
    error: function(error) {
      console.error(`Got an error ${error.code} : ${error.message}`)
    }
  })
})
