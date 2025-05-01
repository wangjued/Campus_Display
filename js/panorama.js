// 建筑模型配置
const LUMA_BUILDINGS = {
  图书馆: {
    id: "6901a08d-b84d-4820-9328-00c9b8d29305",
    params: "mode=sparkles&showMenu=false&background=%23ffffff",
  },
  清泽园: {
    id: "561bd0a0-ef4f-42e4-bd0e-a4fe027d188f",
    params: "mode=sparkles&showMenu=false",
  },
  电机馆: {
    id: "ff60cf85-7760-4f9f-ab60-94d7ae59fd56",
    params: "mode=sparkles&showMenu=false",
  },
  机械馆: {
    id: "84a51d8c-bc0d-4418-8339-7f6956a72b87",
    params: "mode=sparkles&showMenu=false",
  },
  逸夫楼: {
    id: "561bd0a0-ef4f-42e4-bd0e-a4fe027d188f",
    params: "mode=sparkles&showMenu=false",
  },
};

// 当前激活的iframe
let activeIframe = null;
document.addEventListener("DOMContentLoaded", function () {
  // 初始化 Three.js 场景
  const container = document.getElementById("model-viewer");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0xffffff);
  container.appendChild(renderer.domElement);

  // 添加光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // 添加控制器
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // 设置相机位置
  camera.position.set(0, 100, 200); // 初始相机位置
  camera.lookAt(0, 0, 0);

  // 加载模型
  const loader = new THREE.GLTFLoader();
  let model;

  function loadModel(url) {
    loader.load(
      url,
      function (gltf) {
        if (model) {
          scene.remove(model);
        }
        model = gltf.scene;
        scene.add(model);
        // 调整模型位置和大小
        model.position.set(0, 0, 0);
        model.scale.set(100, 100, 100); // 将模型放大100倍
        // 初始旋转180度（绕y轴）
        model.rotation.y = Math.PI; // 180度
        addLabelsToModel();
        animate();
      },
      undefined,
      function (error) {
        console.error("加载模型失败:", error);
      }
    );
  }

  // 初始化加载第一个模型
  loadModel("./图像/模型/全景校园.glb");

  // 标签列表
  const labels = [
    { name: "行政楼", position: { x: 20, y: 20, z: 100 } },
    { name: "图书馆", position: { x: 80, y: 20, z: -80 } },
  ];

  // 存储标签精灵
  const sprites = [];

  // 为模型添加标签
  function addLabelsToModel() {
    labels.forEach((label) => {
      const canvas = document.createElement("canvas");
      canvas.width = 512; // 增大标签宽度
      canvas.height = 128; // 增大标签高度
      const context = canvas.getContext("2d");
      context.fillStyle = "rgba(255, 255, 255, 0.8)";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#000000";
      context.font = "bold 64px Arial"; // 增大字体大小
      context.textAlign = "center";
      context.fillText(label.name, canvas.width / 2, canvas.height / 2 + 10);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(20, 5, 1); // 增大标签大小
      sprite.position.set(label.position.x, label.position.y, label.position.z); // 标签位置
      scene.add(sprite);
      sprites.push({
        sprite,
        name: label.name,
        position: new THREE.Vector3(
          label.position.x,
          label.position.y,
          label.position.z
        ),
      });
    });
  }

  // 动画循环
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  // 调整窗口大小时重新调整渲染器
  window.addEventListener("resize", function () {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  // 模型切换按钮
  document.getElementById("prevButton").addEventListener("click", () => {
    loadModel("./图像/模型/全景校园.glb");
  });

  document.getElementById("nextButton").addEventListener("click", () => {
    loadModel("./图像/模型/全景校园.glb");
  });

  // 搜索功能
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");

  // 存储路径
  let path = null;

  searchButton.addEventListener("click", function () {
    const searchTerm = searchInput.value.toLowerCase();

    if (searchTerm.trim() === "") {
      // 恢复所有标签的默认样式
      sprites.forEach((sprite) => {
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 128;
        const context = canvas.getContext("2d");
        context.fillStyle = "rgba(255, 255, 255, 0.8)";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#000000";
        context.font = "bold 64px Arial";
        context.textAlign = "center";
        context.fillText(sprite.name, canvas.width / 2, canvas.height / 2);
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        sprite.sprite.material = spriteMaterial;
      });
      // 恢复相机初始位置
      camera.position.set(0, 100, 200);
      camera.lookAt(0, 0, 0);
      camera.zoom = 1;
      camera.updateProjectionMatrix();
      // 移除路径
      if (path) {
        scene.remove(path);
        path = null;
      }
      return;
    }

    let found = false;
    sprites.forEach((sprite) => {
      if (sprite.name.toLowerCase().includes(searchTerm)) {
        // 高亮显示匹配的标签
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 128;
        const context = canvas.getContext("2d");
        context.fillStyle = "rgba(255, 255, 0, 0.8)"; // 荧光黄色背景
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#000000";
        context.font = "bold 64px Arial";
        context.textAlign = "center";
        context.fillText(sprite.name, canvas.width / 2, canvas.height / 2);
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        sprite.sprite.material = spriteMaterial;

        // 将标签附近的模型居中并放大
        const targetPosition = sprite.position.clone();
        const distance = 100; // 相机与标签的距离
        const heightOffset = 50; // 相机高度偏移
        camera.position.set(
          targetPosition.x,
          targetPosition.y + heightOffset,
          targetPosition.z + distance
        );
        camera.lookAt(targetPosition);
        camera.zoom = 2; // 放大2倍
        camera.updateProjectionMatrix();
        found = true;
      } else {
        // 恢复不匹配的标签的默认样式
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 128;
        const context = canvas.getContext("2d");
        context.fillStyle = "rgba(255, 255, 255, 0.8)";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#000000";
        context.font = "bold 64px Arial";
        context.textAlign = "center";
        context.fillText(sprite.name, canvas.width / 2, canvas.height / 2);
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        sprite.sprite.material = spriteMaterial;
      }
    });

    if (!found) {
      alert("未找到匹配的标签");
    }
  });
});
