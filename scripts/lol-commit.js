  var LOLCOMMIT = 'https://s3-eu-west-1.amazonaws.com/lolcommits-uploader/';

  var commit = window.document.querySelector('body.page-commit-show');
  var dashboard = window.document.querySelector('body.page-dashboard');
  var pull_request = window.document.querySelector('body.page-pullrequest');

  var lolCommitUrl = function(sha){
        return LOLCOMMIT + sha;
  }

  var lolCommitImg = function(commit_img, sha) {
    var img = window.document.createElement('img');
    var parent_img = commit_img.parentNode;
    img.src = lolCommitUrl(sha);

    /* When the image is loaded, we insert it into the DOM. This event is only
     * fired if the image was loaded successfully, it will not fire if the
     * image does not exist. */
    img.onload = function() {
      img.height = 240;
      img.width = 320;
      parent_img.replaceChild(img, commit_img)
    }
  } 

  var extractSha = function(url){
    var regex = /(\w*)\/commit\/(\w*)$/,
        matches = [];
    
    match = regex.exec(url)
    if (match !== null) {
      matches.push(match[1])
      matches.push(match[2].substr(0,11)) 
    }  
    
    if (!matches.length) {
      return;
    }

    return matches.join('/') + '.jpg';
  }

  var changeAuthorshipAvatar = function(){
    var commit_img = window.document.querySelector('.commit-meta .authorship img.gravatar');
    var sha = extractSha(document.location.pathname);

    if (sha !== null && commit_img !== null)
      lolCommitImg(commit_img, sha)
  }

  var changeCommitsAvatar = function(){
    links = window.document.querySelectorAll('.alert .commits ul li code a:not([data-proccessed])');
    
    for (var i = links.length - 1; i >= 0; i--) {
      var link = links[i],
          sha = extractSha(link.href),
          img;

      img = link.parentNode.parentNode.querySelector('span[title] img');

      if (img)
        lolCommitImg(img, sha);
      else {
        img = link.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('.gravatar img')
        if (img) {
          lolCommitImg(img, sha);
        }
      }
      
      link.setAttribute('data-proccessed', true);
    };
  }

  var changePullCommits = function(){
    links = window.document.querySelectorAll('#commits_bucket .commits td.commit code a');
    commit_imgs = window.document.querySelectorAll('#commits_bucket .commits td.gravatar img');
 
    for (var i = links.length - 1; i >= 0; i--) {
      var link = links[i],
          img = commit_imgs[i],
          sha = extractSha(link.href);

      if (img)
        lolCommitImg(img, sha); 
    };
  }

  if (commit) { 
    changeAuthorshipAvatar();
  }

  if (dashboard) {
    changeCommitsAvatar();
    window.document.addEventListener('DOMNodeInserted', function(){
      changeCommitsAvatar();
    }); 
  }

  if (pull_request) {
    changePullCommits();
  }
