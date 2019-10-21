//A client side script to deal with menu things
$(document).ready(() => {
  //populates an html element with data from a menu item in the db
  const createMenuItemElement = function(item) {
    //current markup for a menu item in html
    const markup = `
  <li class="menu-item">
    <div class="menu-image">
      <img
        src=${item['image_url']}
        alt="">
    </div>
    <div class="menu-item-text">
      <h2 class="menu-item-title">${item['title']}</h2>
      <p class="menu-item-description">${item['description']}</p>
    </div>
      <span class="menu-item-price ">$9.95</span>
    </li><!-- /.menu-item --></li>
    `;
    return markup;
  }
  //creates menu item html elements and attaches them to the correct list in the view
  const renderMenuItems = function(items) {
    console.log(items);
    //each course list has a container id
    const ul_1 = $('#for-the-table-container');
    const ul_2 = $('#greens-container');
    const ul_3 = $('#bowls-container');
    const ul_4 = $('#casual-container');
    const ul_5 = $('#seafood-container');
    const ul_6 = $('#chicken-container');
    const ul_7 = $('#burgers+sandwiches-container');
    const ul_8 = $('#desserts-container');
    for (const item of items) {
      let li = createMenuItemElement(item);
      if (item['course_id'] === 1) { //for the table
        ul_1.append(li);
      } else if (item['course_id'] === 2) { //greens
        ul_2.append(li);
      } else if (item['course_id'] === 3) {//bowls
        ul_3.append(li);
      } else if (item['course_id'] === 4) {//casual
        ul_4.append(li);
      } else if (item['course_id'] === 5) {//seafood
        ul_5.append(li);
      } else if (item['course_id'] === 6) {//chicken
        ul_6.append(li);
      } else if (item['course_id'] === 7) {//burgers and sandwiches
        ul_7.append(li);
      } else if (item['course_id'] === 8) {//desserts
        ul_8.append(li);
      }
    }
  }

  const loadMenu = function() {
    $.ajax({ method: 'GET', url: '/menu/' })
      .then((res) => {
        renderMenuItems(res);
      })
  }
  // calling loadTweets
  loadMenu();
});