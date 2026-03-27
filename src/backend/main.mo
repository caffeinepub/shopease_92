import AccessControl "authorization/access-control";
import BlobStorage "blob-storage/Storage";
import Map "mo:core/Map";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import Array "mo:core/Array";
import MixinStorage "blob-storage/Mixin";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type UserProfile = {
    name : Text;
  };

  module Product {
    public type Product = {
      id : Nat;
      title : Text;
      description : Text;
      price : Nat;
      category : Text;
      brand : Text;
      imageUrl : Text;
      rating : Float;
      stockCount : Nat;
    };

    public type ProductUpdate = {
      title : Text;
      description : Text;
      price : Nat;
      category : Text;
      brand : Text;
      imageUrl : Text;
      rating : Float;
      stockCount : Nat;
    };

    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Text.compare(p1.title, p2.title);
    };
  };

  type CartItem = {
    productId : Nat;
    quantity : Nat;
  };

  type Cart = {
    items : [CartItem];
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  let products = Map.empty<Nat, Product.Product>();
  let carts = Map.empty<Principal, Cart>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextProductId = 10;

  func getProductInternal(id : Nat) : Product.Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  func filterProducts(products : [Product.Product], category : ?Text) : [Product.Product] {
    let filteredProducts = switch (category) {
      case (null) {
        products.values().toArray();
      };
      case (?category) {
        products.values().toArray().filter(func(product) { product.category == category });
      };
    };
    filteredProducts.sort();
  };

  func getCartInternal(user : Principal) : Cart {
    switch (carts.get(user)) {
      case (null) { { items = []; createdAt = Time.now(); updatedAt = Time.now() } };
      case (?cart) { cart };
    };
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Management Functions
  public shared ({ caller }) func addProduct(product : Product.Product) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    let id = nextProductId;
    let newProduct : Product.Product = {
      product with
      id;
    };
    products.add(id, newProduct);
    nextProductId += 1;
    id;
  };

  public shared ({ caller }) func updateProduct(productId : Nat, update : Product.ProductUpdate) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    let existingProduct = getProductInternal(productId);
    let updatedProduct : Product.Product = {
      id = existingProduct.id;
      title = update.title;
      description = update.description;
      price = update.price;
      category = update.category;
      brand = update.brand;
      imageUrl = update.imageUrl;
      rating = update.rating;
      stockCount = update.stockCount;
    };
    products.add(productId, updatedProduct);
  };

  public shared ({ caller }) func deleteProduct(productId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    if (not products.containsKey(productId)) {
      Runtime.trap("Product not found");
    };
    products.remove(productId);
  };

  public query ({ caller }) func getProduct(productId : Nat) : async Product.Product {
    getProductInternal(productId);
  };

  public query ({ caller }) func getAllProducts() : async [Product.Product] {
    let productsArray = products.values().toArray();
    productsArray.sort();
  };

  public query ({ caller }) func getProductsByCategory(category : Text) : async [Product.Product] {
    products
      .values()
      .toArray()
      .filter(func(product) { product.category == category })
      .sort();
  };

  public query ({ caller }) func getProductsFiltered(byCategory : ?Text) : async [Product.Product] {
    filterProducts(products.values().toArray(), byCategory);
  };

  // Cart Management Functions
  public shared ({ caller }) func addToCart(user : Principal, productId : Nat, quantity : Nat) : async () {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only modify your own cart");
    };
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage carts");
    };
    if (quantity <= 0) { Runtime.trap("Quantity must be greater than 0") };
    ignore getProductInternal(productId);
    let cart = getCartInternal(user);
    let updatedItems = cart.items.values().toArray().concat([{ productId; quantity }] : [CartItem]);
    let updatedCart : Cart = {
      items = updatedItems;
      createdAt = cart.createdAt;
      updatedAt = Time.now();
    };
    carts.add(user, updatedCart);
  };

  public shared ({ caller }) func addToCallerCart(productId : Nat, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage carts");
    };
    await addToCart(caller, productId, quantity);
  };

  public shared ({ caller }) func removeFromCart(user : Principal, productId : Nat) : async () {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only modify your own cart");
    };
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage carts");
    };
    let cart = getCartInternal(user);
    let filteredItems = cart.items.values().toArray().filter(
      func(item) {
        item.productId != productId;
      }
    );
    let updatedCart : Cart = {
      items = filteredItems;
      createdAt = cart.createdAt;
      updatedAt = Time.now();
    };
    carts.add(user, updatedCart);
  };

  public shared ({ caller }) func removeFromCallerCart(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage carts");
    };
    await removeFromCart(caller, productId);
  };

  public shared ({ caller }) func updateCartItem(user : Principal, productId : Nat, quantity : Nat) : async () {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only modify your own cart");
    };
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage carts");
    };
    if (quantity <= 0) { Runtime.trap("Quantity must be greater than 0") };
    let cart = getCartInternal(user);
    let updatedItems = cart.items.map(
      func(item) {
        if (item.productId == productId) {
          { productId; quantity };
        } else {
          item;
        };
      }
    );
    let updatedCart : Cart = {
      items = updatedItems;
      createdAt = cart.createdAt;
      updatedAt = Time.now();
    };
    carts.add(user, updatedCart);
  };

  public shared ({ caller }) func updateCallerCartItem(productId : Nat, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage carts");
    };
    await updateCartItem(caller, productId, quantity);
  };

  public query ({ caller }) func getCart(user : Principal) : async Cart {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own cart");
    };
    getCartInternal(user);
  };

  public query ({ caller }) func getCallerCart() : async Cart {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view carts");
    };
    getCartInternal(caller);
  };

  public shared ({ caller }) func clearCart(user : Principal) : async () {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only clear your own cart");
    };
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage carts");
    };
    carts.remove(user);
  };

  public shared ({ caller }) func clearCallerCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage carts");
    };
    carts.remove(caller);
  };

  func seedProducts() {
    let sampleProducts : [Product.Product] = [
      {
        id = 0;
        title = "T-shirt";
        description = "Comfortable cotton t-shirt";
        price = 1999;
        category = "Clothing";
        brand = "FashionCo";
        imageUrl = "https://example.com/tshirt.png";
        rating = 4.5;
        stockCount = 50;
      },
      {
        id = 1;
        title = "Smartphone";
        description = "High-performance smartphone with great camera";
        price = 69999;
        category = "Electronics";
        brand = "TechBrand";
        imageUrl = "https://example.com/phone.png";
        rating = 4.8;
        stockCount = 20;
      },
      {
        id = 2;
        title = "Sneakers";
        description = "Stylish and comfortable sneakers";
        price = 5999;
        category = "Footwear";
        brand = "Sportify";
        imageUrl = "https://example.com/sneakers.png";
        rating = 4.2;
        stockCount = 30;
      },
      {
        id = 3;
        title = "Backpack";
        description = "Spacious backpack with multiple compartments";
        price = 3999;
        category = "Accessories";
        brand = "TravelEase";
        imageUrl = "https://example.com/backpack.png";
        rating = 4.0;
        stockCount = 15;
      },
      {
        id = 4;
        title = "Jeans";
        description = "Classic denim jeans";
        price = 3499;
        category = "Clothing";
        brand = "DenimCo";
        imageUrl = "https://example.com/jeans.png";
        rating = 4.3;
        stockCount = 40;
      },
      {
        id = 5;
        title = "Laptop";
        description = "Powerful laptop for work and entertainment";
        price = 109999;
        category = "Electronics";
        brand = "CompTech";
        imageUrl = "https://example.com/laptop.png";
        rating = 4.7;
        stockCount = 10;
      },
      {
        id = 6;
        title = "Dress";
        description = "Elegant and stylish dress";
        price = 2499;
        category = "Clothing";
        brand = "Fashionista";
        imageUrl = "https://example.com/dress.png";
        rating = 4.4;
        stockCount = 25;
      },
      {
        id = 7;
        title = "Headphones";
        description = "Wireless headphones with noise cancellation";
        price = 8999;
        category = "Electronics";
        brand = "SoundPro";
        imageUrl = "https://example.com/headphones.png";
        rating = 4.6;
        stockCount = 18;
      },
      {
        id = 8;
        title = "Wristwatch";
        description = "Stylish wristwatch with leather strap";
        price = 2999;
        category = "Accessories";
        brand = "Timekeeper";
        imageUrl = "https://example.com/watch.png";
        rating = 4.1;
        stockCount = 12;
      },
      {
        id = 9;
        title = "Sandals";
        description = "Comfortable sandals for summer";
        price = 1999;
        category = "Footwear";
        brand = "SummerWalk";
        imageUrl = "https://example.com/sandals.png";
        rating = 4.0;
        stockCount = 28;
      },
    ];
    sampleProducts.values().forEach(
      func(product) {
        products.add(product.id, product);
      }
    );
  };

  system func preupgrade() {
    ();
  };

  system func postupgrade() {
    seedProducts();
  };
};
