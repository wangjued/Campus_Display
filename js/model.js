document.addEventListener("DOMContentLoaded", function () {
  const modelThumbnails = document.querySelectorAll(".model-thumbnail");
  const modelImage = document.getElementById("model-image");
  const modelDescription = document.getElementById("model-description");
  const model3dView = document.getElementById("model-3d-view");
  const models = {
    model1: {
      name: "图书馆",
      image: "./图像/图书馆.jpg",
      description:
        "太原理工大学迎西校区图书馆是该校历史最悠久的分馆之一。作为学校“双一流”建设的重要支撑，该馆历经百年发展，从传统藏书楼转型为现代化图书馆，2022年馆藏纸质图书超177万册，电子资源丰富，涵盖中外文数据库108个及特色自建数据库。馆内设施先进，提供座位自助选取、图书自助借还等服务，并实现无线网络全覆盖。每日开放时间达16小时（7:00~22:00），年接待读者超200万人次，是师生学习、科研与文化交流的核心场所。",
      modelUrl:
        "https://temp.julianku.eu.org/embed/6901a08d-b84d-4820-9328-00c9b8d29305?mode=sparkles&background=%23ffffff&color=%23000000&showTitle=true&loadBg=true&logoPosition=bottom-left&infoPosition=bottom-right&cinematicVideo=undefined&showMenu=false",
    },
    model2: {
      name: "清泽园",
      image: "./图像/清泽园.jpg",
      description:
        "清泽园位于校区中心，北接图书馆，南邻办公主楼，东西两侧为电机馆与机械馆，形成贯通南北、东西的景观轴线。作为校园的优美景观，是师生舒展心情，感受大自然的胜地。圆中心有着喷泉和人民托举地球的雕塑，其后印有“创造一个有中国特色的高水平的大学。”其历史底蕴浓厚，见证着一代太理学子的青春和风采，是校园里一道靓丽的风景线。",
      modelUrl:
        "https://lumalabs.ai/embed/a442a28e-f2df-4665-8f1f-18cbb7aa1bc7?mode=sparkles&background=%23ffffff&color=%23000000&showTitle=true&loadBg=true&logoPosition=bottom-left&infoPosition=bottom-right&cinematicVideo=undefined&showMenu=false",
    },
    model3: {
      name: "电机馆",
      image: "./图像/电机馆.jpg",
      description:
        "太原理工大学迎西校区电机馆是该校历史悠久的标志性建筑之一，作为电气与动力工程学院的核心教学科研场所，电机馆内设有智能系统与控制实验室、极地监测技术研究团队等，配备无线电装置、无人机、探测小车等先进科研设备，并承担国家级项目研究。该馆还以绿色能源应用著称，楼顶布置风能、太阳能发电装置，形成独立运行的微电网系统，满足建筑的日常用电需求，成为新能源技术实践的典范。其地理位置优越，与机械馆隔园相望，构成校园核心景观轴。",
      modelUrl:
        "https://lumalabs.ai/embed/db04b798-845c-47d1-9a6d-88d9936780ac?mode=sparkles&background=%23ffffff&color=%23000000&showTitle=true&loadBg=true&logoPosition=bottom-left&infoPosition=bottom-right&cinematicVideo=undefined&showMenu=false",
    },
    model4: {
      name: "机械馆",
      image: "./图像/机械馆.jpg",
      description:
        "太原理工大学迎西校区机械馆是该校历史悠久的标志性建筑之一，作为机械工程学院的核心场所，馆内设有党务行政办公室、教学科研办公室及学生工作办公室等，并配备先进实验室，支撑教学与科研活动，其内还配有乒乓球室，供师生休闲运动。近年来，机械馆经历了供电设施改造、屋面防水维修等工程，以消除安全隐患并提升设施可靠性。其地理位置优越，与电机馆隔园相望，构成校园核心景观轴线，兼具学术功能与文化象征意义。",
      modelUrl:
        "https://lumalabs.ai/embed/84a51d8c-bc0d-4418-8339-7f6956a72b87?mode=sparkles&background=%23ffffff&color=%23000000&showTitle=true&loadBg=true&logoPosition=bottom-left&infoPosition=bottom-right&cinematicVideo=undefined&showMenu=false",
    },
    model5: {
      name: "逸夫楼",
      image: "./图像/逸夫楼.jpg",
      description:
        "太原理工大学迎西校区逸夫楼是该校的重要教学与活动场所，其内部设有物理实验室，和众多重要的师生办公室，培育了一代代太理人。楼内设有无人值守的“诚信商铺”，提供文具售卖服务，运营3年诚信率达97%，成为校园诚信教育亮点。逸夫楼一到四层配备自助售卖机，紧挨西门，周边交通便利，邻近多个公交站点，方便师生日常学习与生活。",
      modelUrl:
        "https://lumalabs.ai/embed/561bd0a0-ef4f-42e4-bd0e-a4fe027d188f?mode=sparkles&background=%23ffffff&color=%23000000&showTitle=true&loadBg=true&logoPosition=bottom-left&infoPosition=bottom-right&cinematicVideo=undefined&showMenu=false",
    },
  };

  // 点击模型缩略图时显示详细信息
  modelThumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", function () {
      modelThumbnails.forEach((thumb) => thumb.classList.remove("reversed")); // 移除所有缩略图的反转样式
      this.classList.add("reversed"); // 为当前点击的缩略图添加反转样式
      const modelId = this.getAttribute("data-model-id");
      const model = models[modelId];
      modelImage.src = model.image;
      modelDescription.textContent = model.description;

      // 加载3D视图，使用iframe嵌入模型
      model3dView.innerHTML = `
            <iframe src="${model.modelUrl}" width="100%" height="100%" frameborder="0" allowfullscreen>
                <p>您的浏览器不支持iframe。</p>
            </iframe>
        `;
      model3dView.style.display = "block"; // 显示模型区域
    });
  });
});
