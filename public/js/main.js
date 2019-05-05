$(document).ready(function(){
  $('.delete-job_listing').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/job_listings/'+id,
      success: function(response){
        window.location.href='/job_listings/';
      },
      error: function(err){
        console.log(err);
      }
    });
  });
  $('.delete-job_request').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/job_requests/'+id,
      success: function(response){
        window.location.href='/job_requests/';
      },
      error: function(err){
        console.log(err);
      }
    });
  });
});