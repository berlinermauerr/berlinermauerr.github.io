//Delete Job Listing
$(document).ready(function() {
  $('.delete-job_listing').on('click', function(e) {
    $.ajax({
      type: 'DELETE',
      url: '/listings/' + $(e.target).attr('data-id'),
      success: function(response) {
        window.location.href='/listings/';
      },
      error: function(err) {
        console.log(err);
      }
    });
  });

  //Delete Job Request
  $('.delete-job_request').on('click', function(e) {
    $.ajax({
      type: 'DELETE',
      url: '/requests/' + $(e.target).attr('data-id'),
      success: function(response) {
        window.location.href='/requests/';
      },
      error: function(err) {
        console.log(err);
      }
    });
  });
});