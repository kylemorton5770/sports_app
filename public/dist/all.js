var sportsNewsApp=angular.module("sportsNewsApp",["ngAnimate","app.routes","authService","mainCtrl","userCtrl","userService"]);sportsNewsApp.config(["$httpProvider",function(e){e.interceptors.push("AuthInterceptor")}]),angular.module("app.routes",["ngRoute"]).config(["$routeProvider","$locationProvider",function(e,t){e.when("/",{templateUrl:"app/views/pages/home.html"}).when("/login",{templateUrl:"app/views/pages/login.html",controller:"mainController",controllerAs:"login"}),t.html5Mode(!0)}]),angular.module("mainCtrl",[]).controller("mainController",["$rootScope","$location","$scope","Auth",function(e,t,r,o){var n=this;n.processing=!1,n.retrievedUser=!1,n.postData={},e.$on("$routeChangeStart",function(){n.loggedIn=o.isLoggedIn(),o.getUser().then(function(e){n.user=e.data})}),n.doLogin=function(){n.processing=!0,n.error="",n.loginData&&n.loginData.username&&n.loginData.password?o.login(n.loginData.username,n.loginData.password).success(function(e){n.processing=!1,e.success?t.path("/users"):n.error=e.message}):(n.processing=!1,n.error="Username & Password Required")},n.doLogout=function(){o.logout(),n.user={},t.path("/login")}}]),angular.module("userCtrl",["userService"]).controller("userController",["User","Post",function(e,t){var r=this;r.processing=!0,r.processingPosts=!0,r.loadUsers=function(){e.all().success(function(e){r.processing=!1,r.users=e,r.users.length>=6?$("#userTableDiv").addClass("scrollTable"):$("#userTableDiv").removeClass("scrollTable")})},r.loadUsers(),r.deleteUser=function(t){swal({title:"Are you sure?",text:"You will not be able to recover this user!",type:"warning",showCancelButton:!0,confirmButtonColor:"#DD6B55",confirmButtonText:"Yes, delete it!",closeOnConfirm:!0,closeOnCancel:!0},function(){r.processing=!0,e["delete"](t).success(function(e){r.loadUsers()})})}}]).controller("userCreateController",["User",function(e){var t=this;t.type="create",t.roles=["admin","manager","user"],t.saveUser=function(){t.processing=!0,t.message="",console.log("Creating new user!"),e.create(t.userData).success(function(e){console.log("Created New User!"),t.processing=!1,t.userData={},t.message=e.message})}}]).controller("userEditController",["$routeParams","User",function(e,t){var r=this;r.type="edit",r.roles=["admin","manager","user"],t.get(e.user_id).success(function(e){r.userData=e}),r.saveUser=function(){r.processing=!0,r.message="",t.update(e.user_id,r.userData).success(function(e){r.processing=!1,r.userData={},r.message=e.message})}}]),angular.module("authService",[]).factory("Auth",["$http","$q","AuthToken",function(e,t,r){var o={};return o.login=function(t,o){return e.post("/api/authenticate",{username:t,password:o}).success(function(e){return r.setToken(e.token),e})},o.logout=function(){r.setToken()},o.isLoggedIn=function(){var e=!1;return r.getToken()&&(e=!0),e},o.getUser=function(){return r.getToken()?(console.log("token exists!"),e.get("/api/me")):t.reject({message:"User has no token."})},o}]).factory("AuthToken",["$window",function(e){var t={};return t.getToken=function(){return e.localStorage.getItem("token")},t.setToken=function(t){t?e.localStorage.setItem("token",t):e.localStorage.removeItem("token",t)},t}]).factory("AuthInterceptor",["$q","$location","AuthToken",function(e,t,r){var o={};return o.request=function(e){var t=r.getToken();return t&&(e.headers["x-access-token"]=t),e},o.responseError=function(e){403==e.status&&(r.setToken(),t.path("/login"))},o}]),angular.module("userService",[]).factory("User",["$http",function(e){var t={};return t.get=function(t){return e.get("/api/users/"+t)},t.all=function(){return e.get("/api/users/")},t.create=function(t){return e.post("/api/users/",t)},t.update=function(t,r){return e.put("/api/users/"+t,r)},t["delete"]=function(t){return e["delete"]("/api/users/"+t)},t}]);