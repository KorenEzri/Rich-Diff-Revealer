var hoster_list = [];

var github_hoster = {
  hostname: "github.com",
  mature: false,
  isMangaPage: function () {
    return false;
  },
  currPage: function () {
    return 1;
  },
  /* optional
   * parses the number of pages of the chapter */
  totalPages: function () {
    return 1;
  },
};
hoster_list.push(github_hoster);

var sample_hoster = {
  /* check for hostname is currUrl.contains(hostname) */
  hostname: "example.com",
  /* is the majority of the content targetet to  customers */
  mature: false,
  /* checks if page contains manga. returns true/false */
  isMangaPage: function () {
    return true;
  },
  /* parses the page and gets the url of the manga img */
  img: function () {
    return "img.png";
  },
  /* optional
   * parses the page and gets the url of the next page.
   * if undefined disable timer */
  nextUrl: function () {
    return "http://next";
  },
  /* optional
   * parses the current page number starting at 1
   * used in combination with totalPages */
  currPage: function () {
    return 3;
  },
  /* optional
   * parses the number of pages of the chapter */
  totalPages: function () {
    return 20;
  },
  /* optional
   * returns the manga title. */
  collectionName: function () {
    return "Bliz one RELOADED!";
  },
};

function getHoster(hoster_name, search_list) {
  if (search_list === undefined) search_list = hoster_list;
  if (hoster_name === undefined) hoster_name = window.location.hostname;
  for (i in search_list) {
    if (hoster_name.indexOf(search_list[i].hostname) != -1)
      return search_list[i];
  }
}
