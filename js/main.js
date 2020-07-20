import * as THREE from "./threeJs/three.js";
const Context = canvas.getContext("webgl");
import BasicRubik from "./object/Rubik.js";
/**
 * 主函数
 */
export default class Main {
  constructor() {
    this.context = Context; //绘图上下文
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.devicePixelRatio = window.devicePixelRatio;
    this.viewCenter = new THREE.Vector3(0, 0, 0); //原点

    this.initThree();
    this.initCamera();
    this.initScene();
    this.initLight();
    this.initObject();
    this.render();
  }
  /**
   * 初始化渲染器
   */
  initThree() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvas,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xffffff, 1.0);
  }

  /**
   * 初始化相机
   */
  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.width / this.height,
      1,
      1500
    );
    /**
     * 相机放置在Z轴上方便计算；
     * Z轴坐标需要除以屏幕宽高比保证魔方在不同宽高比的屏幕中宽度所占的比例基本一致
     */
    this.camera.position.set(0, 0, 280 / this.camera.aspect);
    this.camera.up.set(0, 1, 0); //正方向
    this.camera.lookAt(this.viewCenter);

     //轨道视角控制器
    this.orbitController = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.orbitController.enableZoom = false;
    this.orbitController.rotateSpeed = 2;
    this.orbitController.target = this.viewCenter;//设置控制点

    //透视投影相机视角为垂直视角，根据视角可以求出原点所在裁切面的高度，然后已知高度和宽高比可以计算出宽度
    this.originHeight =
      Math.tan((22.5 / 180) * Math.PI) * this.camera.position.z * 2;
    this.originWidth = this.originHeight * this.camera.aspect;

    //UI元素逻辑尺寸和屏幕尺寸比率
    this.uiRadio = this.originWidth / window.innerWidth;
  }

  /**
   * 初始场景
   */
  initScene() {
    this.scene = new THREE.Scene();
  }

  /**
   * 初始化光线
   */
  initLight() {
    this.light = new THREE.AmbientLight(0xfefefe);
    this.scene.add(this.light);
  }

  /**
   * 初始化物体
   */
  initObject() {
    //正视角魔方
    this.frontRubik = new BasicRubik(this);
    this.frontRubik.model(this.frontViewName);
  }
  /**
   * 渲染
   */
  render() {
    this.renderer.clear();

    if (this.tagRubik) {
      this.tagRubik.group.rotation.x += 0.01;
      this.tagRubik.group.rotation.y += 0.01;
    }

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this), canvas);
  }

  /**
   * 立即渲染一次
   */
  renderOnce() {
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
  }
}
