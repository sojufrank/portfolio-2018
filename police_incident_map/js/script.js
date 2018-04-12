/* initMap() cannot be called as a callback from the <script src="callback">
    if it is put into a module design pattern.  For that reason I had to
    create this ultra long function.
*/
function initMap() {
  definePopupClass();

  const seattle = {lat: 47.6097, lng: -122.3331};

  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: seattle,
    gestureHandling: 'greedy'
  });

  const data = controller.getReports();

  console.log(data);

  data.forEach((item, index) => {
    let myLatlng = {};
    (item.latitude && item.longitude)?
      myLatlng = new google.maps.LatLng(item.latitude, item.longitude) :
      myLatlng = new google.maps.LatLng(item.location.latitude, item.location.longitude);

    const marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
    });

    const content = item.offense_type;
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    marker.addListener('click',(e) => {

      const contentParent = document.querySelector('.content-parent');

      try{
        const removalNode = document.querySelector('.popup-tip-anchor');
        contentParent.removeChild(removalNode);
      }
      catch(error){}

      let node = document.createElement('div');
      node.classList.add('content')
      contentParent.appendChild(node);

      let contentDiv = document.querySelector('.content');
      contentDiv.innerHTML = content
      const popup = new Popup(
          new google.maps.LatLng(item.latitude,item.longitude),
          contentDiv);
      popup.setMap(map);
    });
  })
}

let model = {
  init: () => {
    var self = this;
    this.uri = `https://data.seattle.gov/resource/policereport.json`;
  },
  reports: {},
  getUrl: () => {
    return self.uri;
  },
  getData: (url) => {
    return
  },
  getReports: () => {
    return model.reports;
  }
}

let controller = {
  init: () => {
    model.init();
    controller.getData(model.getUrl())
  },
  getData: (url) => {
    fetch(url)
      .then(res => res.json())
      .catch(err => console.log(err))
      .then(data => {
        model.reports = data;
        view.init();
      })
  },
  getReports: () => {
    return model.reports;
  }
}

let view = {
  init: () => {
    view.loadMap();
  },
  loadMap: () => {
    const api = "AIzaSyDbESV5B5nIlPyzvqKs02R1HfcBC59RL8I"
    const js_file = document.createElement('script');
    js_file.type = 'text/javascript';
    js_file.src = `https://maps.googleapis.com/maps/api/js?key=${api}&callback=initMap`;
    document.getElementsByTagName('head')[0].appendChild(js_file);
  }
}

controller.init();
