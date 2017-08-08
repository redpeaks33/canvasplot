
main.directive('lightThreed', function () {
    return {
        restrict: 'EA',
        //replace:false,
        controller: ['$scope', '$rootScope', '$timeout', '$element', function ($scope, $rootScope, $timeout, $element) {
            // Scene variables
            $scope.theeDElement = {
                width: $element[0].offsetWidth,
                height: $element[0].offsetHeight,
                container: angular.element('<div>')[0],
                renderer: new THREE.WebGLRenderer(),
                scene: new THREE.Scene(),
                camera: null,
                controls: null,
                backgroundColor:'#FF0000'
            };

            initialize();
    
            function initialize()
            {
                initialize_scene();
                initialize_model();
                animate();
            }

            function initialize_scene()
            {
                //Container
                $scope.theeDElement.container = angular.element('<div>')[0];
                $element[0].appendChild($scope.theeDElement.container);
                $scope.theeDElement.container.addEventListener('mousedown', clickPosition, false);
                $scope.theeDElement.container.addEventListener('mousemove', hoverPosition, false);

                //Camera
                $scope.theeDElement.camera = new THREE.PerspectiveCamera(50, $scope.theeDElement.width / $scope.theeDElement.height, 1, 1000);
                $scope.theeDElement.camera.position.x = 0;
                $scope.theeDElement.camera.position.y = 0;
                $scope.theeDElement.camera.position.z = 5;

                //Mouse Operation for camera
                $scope.theeDElement.controls = new THREE.OrbitControls($scope.theeDElement.camera);

                //Grid
                var gridXZ = new THREE.GridHelper(10, 1);
                $scope.theeDElement.scene.add(gridXZ);

                //Axis
                var axis = new THREE.AxisHelper(100);
                axis.position.set(0, 0, 0);
                $scope.theeDElement.scene.add(axis);

                //Renderer
                $scope.theeDElement.renderer.setSize($scope.theeDElement.width, $scope.theeDElement.height);
                $scope.theeDElement.renderer.setClearColor($scope.backgroundColor);
                $scope.theeDElement.container.appendChild($scope.theeDElement.renderer.domElement);
            }

            function render() {
                $scope.theeDElement.controls.update();
                $scope.theeDElement.camera.lookAt($scope.theeDElement.scene.position);
                // Traverse the scene, rotate the Mesh object(s)
                $scope.theeDElement.scene.traverse(function (element) {
                    //if (element instanceof THREE.Mesh) {
                    //    element.rotation.x += 0.0065;
                    //    element.rotation.y += 0.0065;
                    //}
                    $scope.theeDElement.renderer.render($scope.theeDElement.scene, $scope.theeDElement.camera);
                });

            };
            
            function animate() {
                requestAnimationFrame(animate);
                render();
            };

            function initialize_model() {
                for (var i = 0; i < 5; i++)
                {
                    //Size
                    geometry = new THREE.BoxGeometry(1/2, 1/2, 1/2);
                    material = new THREE.MeshBasicMaterial({
                        color: '#FF0000'
                    });

                    object = new THREE.Mesh(geometry, material);
                    object.name = i + "imnida";
                    //Position
                    object.position.x = i;
                    object.position.y = i;
                    object.position.z = i;

                    $scope.theeDElement.scene.add(object);
                }

            }
            $scope.point = {};
            function clickPosition(e) {
                var rect = e.target.getBoundingClientRect();

                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                $scope.point = { x: x.toFixed(2), y: y.toFixed(2) };

                var mouse = new THREE.Vector2();
                let container = $scope.theeDElement.container;
                mouse.x = (x / rect.width) * 2 - 1;
                mouse.y = -(y / rect.height) * 2 + 1;
                //mouse.x = (x / window.innerWidth) * 2 - 1;
                //mouse.y = -(y / window.innerHeight) * 2 + 1;

                $scope.mousepoint = { x: mouse.x, y: mouse.y };
                $scope.$apply();
                // Raycasterインスタンス作成
                var raycaster = new THREE.Raycaster();
                // 取得したX、Y座標でrayの位置を更新
                // cameraは作成済みのThree.jsのカメラ
                raycaster.setFromCamera(mouse, $scope.theeDElement.camera);
                // オブジェクトの取得
                // sceneは作成済みのThree.jsのシーン
                var intersects = raycaster.intersectObjects($scope.theeDElement.scene.children);
                // WEBコンソールにオブジェクト上の座標を出力
                if (intersects.length > 0) {
                    _.each(intersects, function (n) {
                        if (n.object.name != '') {
                            alert(n.object.name);
                            var color = new THREE.Color('skyblue');
                            n.object.material.color = color;
                        }
                    })

                    console.log('x座標=%f', intersects[0].point.x);
                    console.log('y座標=%f', intersects[0].point.y);
                    console.log('z座標=%f', intersects[0].point.z);
                    $scope.ThreeD = {
                        X: intersects[0].point.x,
                        Y: intersects[0].point.y,
                        Z: intersects[0].point.z
                    }
                }

            }

            function hoverPosition(e) {
                var rect = e.target.getBoundingClientRect();

                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                $scope.point = { x: x.toFixed(2), y: y.toFixed(2) };

                var mouse = new THREE.Vector2();
                let container = $scope.theeDElement.container;
                mouse.x = (x / rect.width) * 2 - 1;
                mouse.y = -(y / rect.height) * 2 + 1;
                //mouse.x = (x / window.innerWidth) * 2 - 1;
                //mouse.y = -(y / window.innerHeight) * 2 + 1;

                $scope.mousepoint = { x: mouse.x, y: mouse.y };
                $scope.$apply();
                // Raycasterインスタンス作成
                var raycaster = new THREE.Raycaster();
                // 取得したX、Y座標でrayの位置を更新
                // cameraは作成済みのThree.jsのカメラ
                raycaster.setFromCamera(mouse, $scope.theeDElement.camera);
                // オブジェクトの取得
                // sceneは作成済みのThree.jsのシーン
                var intersects = raycaster.intersectObjects($scope.theeDElement.scene.children);
                // WEBコンソールにオブジェクト上の座標を出力
                if (intersects.length > 0) {
                    _.each(intersects, function (n) {
                        if (n.object.name != '') {
                            //alert(n.object.name);
                            var color = new THREE.Color('skyblue');
                            n.object.material.color = color;
                        }
                    })

                    console.log('x座標=%f', intersects[0].point.x);
                    console.log('y座標=%f', intersects[0].point.y);
                    console.log('z座標=%f', intersects[0].point.z);
                    $scope.ThreeD = {
                        X: intersects[0].point.x,
                        Y: intersects[0].point.y,
                        Z: intersects[0].point.z
                    }
                }

            }

            //function clickPosition(e) {
            //    // X座標
            //    var x = event.clientX;
            //    // Y座標
            //    var y = event.clientY;
            //    $scope.point = { x: x.toFixed(2), y: y.toFixed(2) };
               
            //    var mouse = new THREE.Vector2();
            //    let container = $scope.theeDElement.container;
            //    mouse.x = (x / container.offsetWidth) * 2 - 1;
            //    mouse.y = -(y / container.offsetHeight) * 2 + 1;
            //    //mouse.x = (x / window.innerWidth) * 2 - 1;
            //    //mouse.y = -(y / window.innerHeight) * 2 + 1;
            
            //    $scope.mousepoint = { x: mouse.x, y: mouse.y };
            //    $scope.$apply();
            //    // Raycasterインスタンス作成
            //    var raycaster = new THREE.Raycaster();
            //    // 取得したX、Y座標でrayの位置を更新
            //    // cameraは作成済みのThree.jsのカメラ
            //    raycaster.setFromCamera(mouse, $scope.theeDElement.camera);
            //    // オブジェクトの取得
            //    // sceneは作成済みのThree.jsのシーン
            //    var intersects = raycaster.intersectObjects($scope.theeDElement.scene.children);
            //    // WEBコンソールにオブジェクト上の座標を出力
            //    if (intersects.length > 0)
            //    {
            //        if (intersects[0].object.name != '')
            //        {
            //            alert(intersects[0].object.name);
            //        }
            //        console.log('x座標=%f', intersects[0].point.x);
            //        console.log('y座標=%f', intersects[0].point.y);
            //        console.log('z座標=%f', intersects[0].point.z);
            //        $scope.ThreeD  = {
            //            X:intersects[0].point.x,
            //            Y:intersects[0].point.y,
            //            Z:intersects[0].point.z
            //        }
            //    }

            //}

        }],
        link: function (scope, element, attrs) {
       
        }
    };

});