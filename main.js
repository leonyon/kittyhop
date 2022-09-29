import * as THREE from "three";
import { GLTFLoader }  from "https://unpkg.com/three@0.145.0/examples/jsm/loaders/GLTFLoader.js";
import Stats from "https://unpkg.com/three@0.145.0/examples/jsm/libs/stats.module.js";
import { Material, Mesh, MeshBasicMaterial, MeshLambertMaterial, MixOperation, NotEqualStencilFunc, Object3D, Raycaster, Vector3 } from "three";

var inputDown = false;
var inputX = 0;
var inputXLast = 0;
var prestart = true;

/*document.addEventListener(
    "mousedown",
    function(event){
        inputDown = true;
    },
    false
);

document.addEventListener(
    "mouseup",
    function(event){
        inputDown = false;
        
    },
    false
)

document.addEventListener(
    "mousemove",
    function(event){
        let mouseMovement = event.clientX - inputXLast;
        inputX = mouseMovement;
        inputXLast = event.clientX;
    },
    false
);*/

document.addEventListener(
    "touchstart",
    function(event){
        if(event.touches.length > 1){
            event.preventDefault();
        }else{
            if(prestart){
                resetGame()
                prestart = false;
            }
            inputDown = true;
            inputXLast = event.changedTouches[0].clientX;
            if(!alive){
                resetGame();
            }
        }
        
    },
    false
)

document.addEventListener(
    "touchend",
    function(event){
        inputDown = false;
        inputXLast = event.changedTouches[0].clientX;
    },
    false
)

document.addEventListener(
    "touchmove",
    function(event){
        let touchMovement = inputXLast - event.changedTouches[0].clientX;
        inputX = touchMovement;
        inputXLast = event.changedTouches[0].clientX;
    },
    false
);



const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const cameraStartPos = new Vector3(0, 1.2, 6);
            camera.position.z = 6;
            camera.position.y = 1.2;
            camera.rotation.x = -0.45;
            
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);

            window.addEventListener('resize', onWindowResize, false );

            function onWindowResize(){

                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                renderer.setSize( window.innerWidth, window.innerHeight );

            }

            //#region audio
            const listener = new THREE.AudioListener();
            camera.add(listener);
            const bgmusic = new THREE.Audio(listener);
            const sfx_bounce = new THREE.Audio(listener);
            const sfx_score = new THREE.Audio(listener);
            const sfx_advance = new THREE.Audio(listener);
            const sfx_lose = new THREE.Audio(listener);
            const sfx_meow = new THREE.Audio(listener);
            const audioLoader = new THREE.AudioLoader();
            audioLoader.load('./music/background3.wav', function(buffer){
                bgmusic.setBuffer(buffer);
                bgmusic.setLoop(true);
                bgmusic.setVolume(0.4);
                bgmusic.play();
            })
            audioLoader.load('./sfx/bounce.wav', function(buffer){
                sfx_bounce.setBuffer(buffer);
                sfx_bounce.setLoop(false);
                sfx_bounce.setVolume(0.6);
            })
            audioLoader.load('./sfx/advancelevel.wav', function(buffer){
                sfx_advance.setBuffer(buffer);
                sfx_advance.setLoop(false);
                sfx_advance.setVolume(0.6);
            })
            audioLoader.load('./sfx/score.wav', function(buffer){
                sfx_score.setBuffer(buffer);
                sfx_score.setLoop(false);
                sfx_score.setVolume(0.6);
            })
            audioLoader.load('./sfx/lose.wav', function(buffer){
                sfx_lose.setBuffer(buffer);
                sfx_lose.setLoop(false);
                sfx_lose.setVolume(0.6);
            })
            audioLoader.load('./sfx/meow.mp3', function(buffer){
                sfx_meow.setBuffer(buffer);
                sfx_meow.setLoop(false);
                sfx_meow.setVolume(0.6);
            })
            //#endregion
            

            const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
            scene.add(ambientLight);

            const frontLight = new THREE.DirectionalLight(0xdddd33, 1);
            frontLight.position.set(10, 20, 10);
            scene.add(frontLight);

            //#region textures
            const tex_tree = new THREE.TextureLoader().load("./textures/tree.png");
            tex_tree.wrapS = THREE.RepeatWrapping;
            tex_tree.wrapT = THREE.RepeatWrapping;
            tex_tree.repeat.set(1, 250);
            const mat_tree = new MeshLambertMaterial({ map: tex_tree });

            const tex_metalbeam = new THREE.TextureLoader().load("./textures/metalbeam.png");
            tex_metalbeam.wrapS = THREE.RepeatWrapping;
            tex_metalbeam.wrapT = THREE.RepeatWrapping;
            tex_metalbeam.repeat.set(1, 250);
            const mat_metalbeam = new MeshLambertMaterial({ map: tex_metalbeam });

            const tex_soda = new THREE.TextureLoader().load("./textures/soda.png");
            tex_soda.wrapS = THREE.RepeatWrapping;
            tex_soda.wrapT = THREE.RepeatWrapping;
            tex_soda.repeat.set(3, 250);
            const mat_soda= new MeshLambertMaterial({ map: tex_soda });

            const tex_leaves = new THREE.TextureLoader().load("./textures/leaves.png");
            tex_leaves.wrapS = THREE.RepeatWrapping;
            tex_leaves.wrapT = THREE.RepeatWrapping;
            tex_leaves.repeat.set(2, 2);
            const mat_leaves= new MeshLambertMaterial({ map: tex_leaves });

            const tex_metalfloor = new THREE.TextureLoader().load("./textures/metalfloor.png");
            tex_metalfloor.wrapS = THREE.RepeatWrapping;
            tex_metalfloor.wrapT = THREE.RepeatWrapping;
            tex_metalfloor.repeat.set(2, 2);
            const mat_metalfloor= new MeshLambertMaterial({ map: tex_metalfloor });

            const tex_burger = new THREE.TextureLoader().load("./textures/burger.png");
            tex_burger.wrapS = THREE.RepeatWrapping;
            tex_burger.wrapT = THREE.RepeatWrapping;
            tex_burger.repeat.set(2, 2);
            const mat_burger= new MeshLambertMaterial({ map: tex_burger });

            const tex_bg_tree = new THREE.TextureLoader().load("./textures/bg_tree.png");
            tex_bg_tree.wrapS = THREE.ClampToEdgeWrapping
            tex_bg_tree.wrapT = THREE.ClampToEdgeWrapping;
            tex_bg_tree.repeat.set(1, 1);

            const tex_bg_metal = new THREE.TextureLoader().load("./textures/bg_metal.png");
            tex_bg_metal.wrapS = THREE.ClampToEdgeWrapping
            tex_bg_metal.wrapT = THREE.ClampToEdgeWrapping;
            tex_bg_metal.repeat.set(1, 1);

            const tex_bg_burger = new THREE.TextureLoader().load("./textures/bg_burger.png");
            tex_bg_burger.wrapS = THREE.ClampToEdgeWrapping
            tex_bg_burger.wrapT = THREE.ClampToEdgeWrapping;
            tex_bg_burger.repeat.set(1, 1);
            //#endregion

            const middleCylinderGeometry = new THREE.CylinderGeometry(1, 1, 1000, 8, 2, false);
            const middleCylinderMaterial = new THREE.MeshLambertMaterial({ map: tex_tree });
            const middleCylinder = new THREE.Mesh(middleCylinderGeometry, middleCylinderMaterial);
            scene.add(middleCylinder);

            const platformModels = [];
            platformModels[0] = "./models/platform_singlegap_safe.glb";
            platformModels[1] = "./models/platform_singlegap2.glb";
            platformModels[2] = "./models/platform_singlegap3.glb";
            platformModels[3] = "./models/platform_singlegap4.glb";
            platformModels[4] = "./models/platform_singlegap5.glb";
            platformModels[5] = "./models/platform_doublegap1.glb";
            platformModels[6] = "./models/platform_doublegap2.glb";
            platformModels[7] = "./models/platform_doublegap3.glb";
            platformModels[8] = "./models/platform_triplegap1.glb";
            platformModels[9] = "./models/platform_triplegap2.glb";
            platformModels[10] = "./models/platform_triplegap3.glb";
            platformModels[11] = "./models/platform_triplegap4.glb";

            var alive = true;

            const clock = new THREE.Clock();
            clock.autoStart = true;

            const downDirection = new THREE.Vector3(0, -1, 0);
            
            var vspeed = 0;
            const gravity = 0.9;
            var playerRayPos = new Vector3(0, 1, 1);
            const playerRay = new THREE.Raycaster();
            const player = new THREE.Object3D();
                
            var intersectsPlatforms;
            var intersectsDangers;
            var intersectGoal;

            var level = 0;
            const lastlevel = 2;
            var nextLevel = -100;
            var score = 0;
            var streak = 0;
            var lastScored = 0;
            const platformHeight = -3;

            var platforms = [];
            var dangers = [];
            var particles_jump = new THREE.Group();
            var particles_fall = new THREE.Group();
            var particles_brokenPlatform = new THREE.Group();
            var goal = new THREE.Object3D();
            const maxPlatforms = 10;
            var lastPlatform = 0;
            var platformMaterial = mat_leaves;
            const levelGroup = new THREE.Group();
            const loader = new GLTFLoader();

            var playerMixer;
            var playerClips;
            var clip_bounce;
            var animAction_bounce;
            var clip_fallslow;
            var animAction_fallslow;
            var clip_fallfast;
            var animAction_fallfast;
            var clip_rise;
            var animAction_rise;
            var clip_lose;
            var animAction_lose;

            function startGame(){
                scene.add(particles_jump);
                scene.add(particles_fall);
                scene.add(particles_brokenPlatform);
                scene.background = tex_bg_tree;
                
                for(let currentPlatform = 0; currentPlatform < maxPlatforms; currentPlatform++){
                    if(currentPlatform == 0){ createNewPlatform(true); }else{ createNewPlatform(false); }
                    
                }
                scene.add(levelGroup);

                if(player.children.length == 0){
                    loader.load(
                        "./models/player.glb",
                        (gltf) => {
                            let scale = 0.4;
                            gltf.scene.scale.set(scale, scale, scale);
                            gltf.scene.position.y = 1;
                            gltf.scene.position.z = 1.5;
                            player.add(gltf.scene);
                            playerMixer = new THREE.AnimationMixer(gltf.scene);
                            playerClips = gltf.animations;
                            clip_bounce = THREE.AnimationClip.findByName(playerClips, 'Bounce');
                            animAction_bounce = playerMixer.clipAction(clip_bounce);
                            animAction_bounce.loop = THREE.LoopOnce;
                            clip_fallslow = THREE.AnimationClip.findByName(playerClips, 'Fall_Slow');
                            animAction_fallslow = playerMixer.clipAction(clip_fallslow);
                            animAction_fallslow.play();
                            clip_fallfast = THREE.AnimationClip.findByName(playerClips, 'Fall_Fast');
                            animAction_fallfast = playerMixer.clipAction(clip_fallfast);
                            animAction_fallfast.play();
                            clip_rise = THREE.AnimationClip.findByName(playerClips, 'Rise');
                            animAction_rise = playerMixer.clipAction(clip_rise);
                            animAction_rise.play();
                            clip_lose = THREE.AnimationClip.findByName(playerClips, 'Lose');
                            animAction_lose = playerMixer.clipAction(clip_lose);
                            animAction_lose.loop = THREE.LoopOnce;
                            animAction_lose.clampWhenFinished = true;
                            
                        },
                        undefined,
                        function(error){
                            console.error(error);
                        }
                    );
                }
                scene.add(player);
            }
            startGame();

            function resetGame(){
                platforms.forEach(element => function(element){
                    element.geometry.dispose();
                    element.material.dispose();
                });
                platforms = [];
                dangers.forEach(element => function(element){
                    element.geometry.dispose();
                    element.material.dispose();
                });
                dangers = [];
                player.clear();
                particles_fall.clear();
                scene.remove(player);
                scene.remove(levelGroup);
                levelGroup.clear();
                player.position.set(0, 0, 0);
                levelGroup.rotation.y = 0;
                camera.position.y = 1.2;
                camera.position.z = 6;
                vspeed = 0;
                alive = true;
                streak = 0;
                score = 0;
                lastPlatform = 0;
                lastScored = 0;
                nextLevel = -100;
                level = 0;
                scene.background = tex_bg_tree;
                platformMaterial = mat_leaves;
                middleCylinder.material = mat_tree;
                startGame();
            }

            function advanceLevel(){
                level++;
                if(level > lastlevel){
                    level = 0;
                }

                if(level == 0){platformMaterial = mat_leaves; middleCylinder.material = mat_tree; scene.background = tex_bg_tree;}
                if(level == 1){platformMaterial = mat_metalfloor; middleCylinder.material = mat_metalbeam; scene.background = tex_bg_metal;}
                if(level == 2){platformMaterial = mat_burger; middleCylinder.material = mat_soda; scene.background = tex_bg_burger;}


                for(let i = 0; i < levelGroup.children.length; i++){
                    levelGroup.children[i].children[0].material = platformMaterial;
                }

                for(let n = 0; n < 30; n++){
                    let partBrokenPlatformParent = new THREE.Object3D();
                    let geo = new THREE.SphereGeometry(Math.random() * 0.3 + 0.5, 15, 15);
                    let part = new THREE.Mesh(geo, new MeshBasicMaterial({ color:0xaaaaaa }));
                    partBrokenPlatformParent.add(part);
                    particles_brokenPlatform.add(partBrokenPlatformParent);
                    part.position.x = Math.random() * 5 - Math.random() * 5;
                    part.position.y = player.position.y + Math.random() * 5 - Math.random() * 5
                    part.position.z = Math.random() * 5 - Math.random() * 5;
                
                    partBrokenPlatformParent.rotation.y = -particles_brokenPlatform.rotation.y;
                } 
                sfx_advance.play();
            }

            
            
            function movePlayer(deltaTime){
                vspeed += deltaTime * 0.1;
                if(vspeed < 0){
                    animAction_fallfast.stop();
                    animAction_fallslow.stop();
                    if(!animAction_rise.isRunning()){
                        animAction_rise.play();
                        animAction_rise.crossFadeFrom(animAction_bounce, 0.3);
                    }
                    
                }
                if(vspeed > 0.05){
                    if(!animAction_fallslow.isRunning()){
                        animAction_fallslow.play();
                        animAction_fallslow.crossFadeFrom(animAction_rise, 0.5);
                    }
                    let partFallParent = new THREE.Object3D();
                    let geo = new THREE.SphereGeometry(Math.random() * 0.1, 15, 15);
                    let part = new THREE.Mesh(geo, new MeshBasicMaterial({ color:0xffaa22 }));
                    partFallParent.add(part);
                    particles_fall.add(partFallParent);
                    part.position.x = player.position.x + Math.random() * 0.5 - Math.random() * 0.5;
                    part.position.y = player.position.y + 1.5;
                    part.position.z = 1.5 + Math.random() * 0.5 - Math.random() * 0.5;
                
                    partFallParent.rotation.y = -particles_fall.rotation.y;
                }
                if(vspeed > 0.1){ 
                    if(!animAction_fallfast.isRunning()){
                        animAction_fallfast.play();
                        animAction_fallfast.crossFadeFrom(animAction_fallslow, 0.5);
                    }
                    vspeed = 0.1;
                    let partFallParent = new THREE.Object3D();
                        let geo = new THREE.SphereGeometry(Math.random() * 0.2, 15, 15);
                        let part = new THREE.Mesh(geo, new MeshBasicMaterial({ color:0xff2222 }));
                        partFallParent.add(part);
                        particles_fall.add(partFallParent);
                        part.position.x = player.position.x + Math.random() * 0.5 - Math.random() * 0.5;
                        part.position.y = player.position.y + 1.5;
                        part.position.z = 1.5 + Math.random() * 0.5 - Math.random() * 0.5;
                    
                        partFallParent.rotation.y = -particles_fall.rotation.y;
                }
                player.translateY(-vspeed);
                if(player.position.y < camera.position.y - 3){
                    camera.position.y -= vspeed;
                }
                playerRay.near = 0;
                playerRay.far = 0.1;
                playerRayPos.y = player.position.y;
                playerRayPos.y += 0.9;
                playerRay.set(playerRayPos, downDirection);
                intersectsPlatforms = playerRay.intersectObjects(platforms);

                if(player.position.y < nextLevel){
                    advanceLevel();
                    nextLevel -= 100;
                }

                for(let i = 0; i < intersectsPlatforms.length; i++){
                    vspeed = -0.05;
                    streak = 0;
                    animAction_rise.stop();
                    animAction_fallfast.stop();
                    animAction_fallslow.stop();
                    animAction_bounce.reset();
                    animAction_bounce.play();
                    sfx_bounce.play();
                    for(let n = 0; n < 10; n++){
                        let partJumpParent = new THREE.Object3D();
                        let geo = new THREE.SphereGeometry(Math.random() * 0.3, 15, 15);
                        let part = new THREE.Mesh(geo, new MeshBasicMaterial({ color:0xffffff }));
                        partJumpParent.add(part);
                        particles_jump.add(partJumpParent);
                        part.position.x = player.position.x + Math.random() * 0.5 - Math.random() * 0.5;
                        part.position.y = player.position.y + 0.7;
                        part.position.z = 1.5 + Math.random() * 0.5 - Math.random() * 0.5;
                    
                        partJumpParent.rotation.y = -particles_jump.rotation.y;
                    } 
                }

                intersectsDangers = playerRay.intersectObjects(dangers);
                for(let i = 0; i < intersectsDangers.length; i++){
                    console.log("Player lost.");
                    vspeed = 0;
                    alive = false;
                    playerMixer.stopAllAction();
                    animAction_lose.play();
                    sfx_lose.play();
                    sfx_meow.play();
                }

                intersectGoal = playerRay.intersectObject(goal);
                for(let i = 0; i < intersectGoal.length; i++){
                    advanceLevel();
                    break;
                }

                if(player.position.y < lastScored * platformHeight - 2){
                    lastScored++;
                    streak++;
                    score += streak;
                    sfx_score.play();
                    for(let i = 0; i < levelGroup.children.length; i++){
                        if(levelGroup.children[i].position.y > player.position.y && levelGroup.children[i]){
                            for(let n = 0; n < 30; n++){
                                let partBrokenPlatformParent = new THREE.Object3D();
                                let geo = new THREE.SphereGeometry(Math.random() * 0.3 + 0.1, 15, 15);
                                let part = new THREE.Mesh(geo, new MeshBasicMaterial({ color:0xaaaaaa }));
                                partBrokenPlatformParent.add(part);
                                particles_brokenPlatform.add(partBrokenPlatformParent);
                                part.position.x = Math.random() * 2 - Math.random() * 2;
                                part.position.y = levelGroup.children[i].position.y + Math.random() * 0.3 - Math.random() * 0.3;
                                part.position.z = Math.random() * 2 - Math.random() * 2;
                            
                                partBrokenPlatformParent.rotation.y = -particles_brokenPlatform.rotation.y;
                            } 
                            levelGroup.remove(levelGroup.children[i]);
                            createNewPlatform()
                        }
                    }
                    
                }
            }

            function createNewPlatform(first){
                let roll = 0;
                    if(!first){
                        roll = Math.round(Math.random() * (platformModels.length - 1));
                    }
                    loader.load(
                        platformModels[roll],
                        (gltf) => {
                            let scale = 2;
                            platforms.push(gltf.scene.children[0]);
                            gltf.scene.children[0].material = platformMaterial;
                            for(let n = 0; n < gltf.scene.children[0].children.length; n++){
                                if(gltf.scene.children[0].children[n].isMesh){ 
                                    dangers.push(gltf.scene.children[0].children[n]); 
                                }
                            }
                            gltf.scene.scale.set(scale * 1.1, scale, scale * 1.1);
                            let rotationRoll = Math.random() * (0.5 - 0.1) + 0.1;
                            
                            if(first){
                                gltf.scene.rotation.y = 0.5;
                                first = false;
                            }else{
                                gltf.scene.rotation.y = 0.6 + lastPlatform * rotationRoll;
                            }
                            gltf.scene.position.y = lastPlatform * platformHeight;
                            levelGroup.add(gltf.scene);
                            lastPlatform++;
                        },
                        undefined,
                        function (error){
                            console.error(error);
                        }
                    );
                
            }

            

            var stats = new Stats();
            stats.showPanel(0);
            document.body.appendChild(stats.dom);

            function animate(){
                requestAnimationFrame(animate);

                var deltaTime = clock.getDelta();

                if(playerMixer){
                    playerMixer.update(deltaTime);
                }

                if(alive){
                    movePlayer(deltaTime);
                    document.getElementById("endScore").innerHTML = "";
                    document.getElementById("restart").innerHTML = "";
                    if(inputDown){
                        levelGroup.rotation.y += inputX * 0.005;
                        middleCylinder.rotation.y = levelGroup.rotation.y;
                        //middleCylinderBottom.rotation.y = levelGroup.rotation.y;
                        particles_jump.rotation.y = levelGroup.rotation.y;
                        particles_fall.rotation.y = levelGroup.rotation.y;
                        particles_brokenPlatform.rotation.y = levelGroup.rotation.y;
                        inputX = 0;
                    }
                }else if(!prestart){
                    //resetGame();
                    document.getElementById("endScore").innerHTML = "Score: " + score;
                    document.getElementById("restart").innerHTML = "Tap anywhere to restart";
                }

                if(prestart){
                    document.getElementById("restart").innerHTML = "Tap to start";
                }

                
                updateParticles(deltaTime);
                
                renderer.render(scene, camera);
                //document.getElementById("stats").innerHTML = inputDown + "<br>" + inputX + "<br>" + inputXLast;
                document.getElementById("score").innerHTML = score;
                stats.update();
            }
            animate();

            function updateParticles(deltaTime){
                deltaTime *= 0.01;
                for(let i = 0; i < particles_jump.children.length; i++){
                    particles_jump.children[i].children[0].material.color.r *= 0.98;
                    particles_jump.children[i].children[0].material.color.g *= 0.98;
                    particles_jump.children[i].children[0].material.color.b *= 0.98;
                    particles_jump.children[i].children[0].position.y += deltaTime * (20 + Math.random() * 120);
                    particles_jump.children[i].children[0].position.x += deltaTime * (-30 + Math.random() * 60);
                    particles_jump.children[i].children[0].position.z += deltaTime * (-30 + Math.random() * 60);
                    let scale = particles_jump.children[i].children[0].scale.x;
                    scale *= 0.95 + Math.random() * 0.03;
                    particles_jump.children[i].children[0].scale.set(scale, scale, scale);
                    if(particles_jump.children[i].children[0].scale.x < 0.01){
                        particles_jump.children[i].children[0].geometry.dispose();
                        particles_jump.children[i].children[0].material.dispose();
                        particles_jump.remove(particles_jump.children[i]);
                    }
                }

                for(let i = 0; i < particles_fall.children.length; i++){
                    particles_fall.children[i].children[0].material.color.r *= 0.97;
                    particles_fall.children[i].children[0].material.color.g *= 0.97;
                    particles_fall.children[i].children[0].material.color.b *= 0.97;
                    particles_fall.children[i].children[0].position.y += deltaTime * (40 + Math.random() * 160);
                    particles_fall.children[i].children[0].position.x += deltaTime * (-30 + Math.random() * 60);
                    particles_fall.children[i].children[0].position.z += deltaTime * (-30 + Math.random() * 60);
                    let scale = particles_fall.children[i].children[0].scale.x;
                    scale *= 0.95 + Math.random() * 0.03;
                    particles_fall.children[i].children[0].scale.set(scale, scale, scale);
                    if(particles_fall.children[i].children[0].scale.x < 0.01){
                        particles_fall.children[i].children[0].geometry.dispose();
                        particles_fall.children[i].children[0].material.dispose();
                        particles_fall.remove(particles_fall.children[i]);
                    }
                }

                for(let i = 0; i < particles_brokenPlatform.children.length; i++){
                    particles_brokenPlatform.children[i].children[0].material.color.r *= 0.97;
                    particles_brokenPlatform.children[i].children[0].material.color.g *= 0.97;
                    particles_brokenPlatform.children[i].children[0].material.color.b *= 0.97;
                    particles_brokenPlatform.children[i].children[0].position.y += deltaTime * (-10 + Math.random() * 20);
                    particles_brokenPlatform.children[i].children[0].position.x += deltaTime * (-30 + Math.random() * 60);
                    particles_brokenPlatform.children[i].children[0].position.z += deltaTime * (-30 + Math.random() * 60);
                    let scale = particles_brokenPlatform.children[i].children[0].scale.x;
                    scale *= 0.95 + Math.random() * 0.03;
                    particles_brokenPlatform.children[i].children[0].scale.set(scale, scale, scale);
                    if(particles_brokenPlatform.children[i].children[0].scale.x < 0.01){
                        particles_brokenPlatform.children[i].children[0].geometry.dispose();
                        particles_brokenPlatform.children[i].children[0].material.dispose();
                        particles_brokenPlatform.remove(particles_brokenPlatform.children[i]);
                    }
                }
            }

