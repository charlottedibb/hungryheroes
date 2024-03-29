// ~~~~~ A client side script to deal with menu things ~~~~~ //
$(document).ready(() => {

  // ----- populates an html element with data from a menu item in the db ----- //
  const createMenuItemElement = function (item) {
    // ----- current markup for a menu item in html ----- //
    const markup = `
    <li class="menu-item">
    <div class="menu-item-container">
      <div class="menu-image">
        <img
          src=${item['image_url']}
          alt="">
      </div>
      <div class="menu-item-text">
        <h2 class="menu-item-title">${item['title']}</h2>
        <p class="menu-item-description">${item['description']}</p>
      </div>
        <span class="menu-item-price ">$${(item['price'] / 100).toFixed(2)}</span>
      </div>
        <section class="sides-container" id="sides-container-${item['id']}">
        <div class="menu-item" id="sides-item">
        <div class="sides-header">
        <span style="font-size: 1.3rem">EXTRAS</span>
        <br>
        <span>Would you like to add a side for your meal?</span>
        </div>
        <div class="sides-body">
        <div class="form-order">
        <form class="form-body" action="/cart" method="POST" id="item-${item['id']}">
        <input type="hidden" name="main" value="${item['title']}">
        <div class="form-row">
        <label class="form-label">ADD A SIDE</label>
        <div class="form-controls">
        <ul class="list-checkboxes" id="food-sides">
        <li class="list-sides">
        <div class="checkbox">
        <input type="checkbox" name="FRIES" id="fries">
        <label class="option" for='fries'><div class="sides-title">Fries</div>
        <div class="sides-price">$2.00</div>
        </label>
        </div>
        </li>
        <li class="list-sides">
        <div class="checkbox">
        <input type="checkbox" name="SOUP" id="soup">
        <label class="option" for='soup'><div class="sides-title">Soup</div>
        <div class="sides-price">$2.00</div>
        </label>
        </div>
        </li>
        <li class="list-sides">
        <div class="checkbox">
        <input type="checkbox" name="SALAD" id="salad">
        <label class="option" for='salad'><div class="sides-title">Salad</div>
        <div class="sides-price">$1.50</div>
        </label>
        </div>
        </li>
        </ul>
        </div>
        </div>
        <div class="form-row">
        <label class="form-label">ADD A DRINK</label>
        <div class="form-controls">
        <ul class="list-checkboxes" id="drink-sides">
        <li class="list-sides">
        <div class="checkbox">
        <input type="checkbox" name="COKE" id="coke">
        <label class="option" for="coke"><div class="sides-title">Coke</div>
        <div class="sides-price">$2.00</div>
        </label>
        </div>
        </li>
        <li class="list-sides">
        <div class="checkbox">
        <input type="checkbox" name="ICE TEA" id="icetea">
        <label class="option" for='icetea'><div class="sides-title">Ice tea</div>
        <div class="sides-price">$2.00</div>
        </label>
        </div>
        </li>
        <li class="list-sides">
        <div class="checkbox">
        <input type="checkbox" name="SPRITE" id="sprite">
        <label class="option" for='sprite'><div class="sides-title">Sprite</div>
        <div class="sides-price">$2.00</div>
        </label>
        </div>
        </li>
        </ul>
        </div>
        </div>
        </form>
        </div>
        </div>
        <div class="sides-footer">
        <div class="form-actions">
        <button type="button" form="item-${item['id']}" value="Submit" class="btn btn-dark btn-block add-order">ADD TO ORDER</button>
        </div>
        <button class="btn btn-block btn-danger menu-item-button-cancel">CANCEL</button>
        </div>
        </div>
        </section>
      </li><!-- /.menu-item --></li>
      `;
    return markup;
  };
  // ----- creates menu item html elements and attaches them to the correct list in the view ----- //
  const renderMenuItems = function (items) {
    // ----- each course list has a container id ----- //
    const ul_1 = $('#for-the-table-container');
    const ul_2 = $('#greens-container');
    const ul_3 = $('#bowls-container');
    const ul_4 = $('#casual-container');
    const ul_5 = $('#seafood-container');
    const ul_6 = $('#pasta-container');
    const ul_7 = $('#chicken-container');
    const ul_8 = $('#burgers-sandwiches-container');
    const ul_9 = $('#desserts-container');
    for (const item of items) {
      let li = createMenuItemElement(item);
      if (item['course_id'] === 1) { // ----- for the table
        ul_1.append(li);
      } else if (item['course_id'] === 2) { //greens
        ul_2.append(li);
      } else if (item['course_id'] === 3) {//bowls
        ul_3.append(li);
      } else if (item['course_id'] === 4) {//casual
        ul_4.append(li);
      } else if (item['course_id'] === 5) {//pasta
        ul_5.append(li);
      } else if (item['course_id'] === 6) {//seafood
        ul_6.append(li);
      } else if (item['course_id'] === 7) {//chicken
        ul_7.append(li);
      } else if (item['course_id'] === 8) {//burgers and sandwiches
        ul_8.append(li);
      } else if (item['course_id'] === 9) {//desserts
        ul_9.append(li);
      }
    }
  };

  // ----- replaces cart items container with everything in the cart ----- //
  // ----- called each time an item is added to order ----- //
  $(document).on("click", ".cart-minus", function () {
    let foodItem = $(this).attr('id');
    if (cart[foodItem].amount === 0 ) {
      delete cart[foodItem];
    }
    let pricePerItem = cart[foodItem].price / cart[foodItem].amount;
    cart[foodItem].amount--;
    cart[foodItem].price -= pricePerItem;
    if (cart[foodItem].amount === 0 ) {
      delete cart[foodItem];
    }
    updateCart();
  })

  $(document).on("click", ".cart-plus", function () {
    let foodItem = $(this).attr('id');

    let pricePerItem = cart[foodItem].price / cart[foodItem].amount;
    // console.log(cart[foodItem].amount)
    cart[foodItem].amount++;
    cart[foodItem].price += pricePerItem;
    updateCart();
  });

  const updateCart = function () {
    let totalPrice = 0;
    let markup = `<ul class="cart-items">`;
    for (const item in cart) {
      totalPrice += cart[item].price;
      console.log(cart[item].amount)
      markup += `
      <li class="cart-item">
        <div class="cart-update">
        <i class="fa fa-minus-square-o fa-lg cart-controls cart-minus" id="${item}"></i>
        <div class="cart-item-quantity">${cart[item].amount}</div>
        <i class="fa fa-plus-square-o fa-lg cart-controls cart-plus" id="${item}"></i>
        </div>
        <div class="cart-info">
        <h2 class="cart-item-title">${item}</h2>
        <div class="cart-item-price">$${(cart[item].price).toFixed(2)}</div>
        </div>
      </li><!-- /.cart-item -->`;
    }
    markup += `</ul><!-- /.cart-items -->`
    $('.cart-items').replaceWith(markup);
    $('.cart-total-amount')[0].style.color = 'black';
    $('.cart-total-amount').html(`$${totalPrice.toFixed(2)}`);
  };

  // ----- loads the rendered markup menu ----- //
  const loadMenu = function () {
    $.ajax({ method: 'GET', url: '/menu' })
      .then((res) => {
        renderMenuItems(res);
        $(".menu-item-container").click((event) => {
          // ----- the element where thre currently called jQuery event handler was attached to its next sibling ----- //
          const item = $(event.delegateTarget.nextElementSibling);
          // ----- closes all other open sides-menus if opening a new side-menu ----- //
          if (item.is(':hidden')) {
            $('.sides-container').slideUp('slow', () => {
            });
          }

          // ----- if open, closes the menu and gets ride of shadow, if closed opens the menu and adds the shadow ----- //
          item.slideToggle("slow", () => {
            $("input:checkbox").prop("checked", false);
          });
        });

        // ----- closes the sides-menu with the cancel button, reseting the checkboxes ----- //
        $(".menu-item-button-cancel").click((event) => {
          const item = $(event.target);
          item.closest('.sides-container').slideUp("slow", () => {
            $("input:checkbox").prop("checked", false);
          });

        });

        // ----- same as cancel button for menu closing purposes ----- //
        $(".add-order").click((event) => {
          const item = $(event.target);
          item.closest('.sides-container').slideUp("slow", () => {
            $("input:checkbox").prop("checked", false);
          });
        });

        $(".add-order").click(function (event) {
          const formId = $(event.target).attr('form');

          // ----- gets the values from the form and adds them to the cart object ----- //
          $.each($(`#${formId}`).serializeArray(), function (i, field) {

            if (field.name === 'main') {
              const menuItemRow = res.filter(menuItem => menuItem.title === field.value);
              if (cart[field.value]) {
                cart[field.value].amount += 1;
                cart[field.value].price += menuItemRow[0].price / 100;
              } else {
                cart[field.value] = {
                  amount: 1,
                  price: menuItemRow[0].price / 100
                };
              }
            } else {
              const menuItemRow = res.filter(menuItem => menuItem.title === field.name);
              if (cart[field.name]) {
                cart[field.name].amount += 1;
                cart[field.name].price += menuItemRow[0].price / 100;
              } else {
                cart[field.name] = {
                  amount: 1,
                  price: menuItemRow[0].price / 100
                };
              }
            }
          });




          // ----- calling updateCart ----- //
          updateCart();

          // ----- slides payment button and cart total into view ----- //
          $('.hide-cart').slideDown("slow", () => {
          });
        });
      });
  };
  // ----- calling loadTweets ----- //
  loadMenu();
});
