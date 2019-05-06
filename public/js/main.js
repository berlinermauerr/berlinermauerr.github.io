$(document).ready(function(){
  $('.delete-job_listing').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/listings/'+id,
      success: function(response){
        window.location.href='/listings/';
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
      url: '/requests/'+id,
      success: function(response){
        window.location.href='/requests/';
      },
      error: function(err){
        console.log(err);
      }
    });
  });
});