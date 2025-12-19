// Bulutları temsil eden sınıf. Hareket eden bulut nesneleri oluşturur.
class Clouds extends MovableObject {

    // Bulutun başlangıç yüksekliği (y ekseni)
    y = 50;

    // Bulutun genişliği
    width = 500;

    // Bulutun yüksekliği
    height = 150;
  
    
    constructor() {
        super();  
        // MovableObject içindeki özellikleri çalıştırır

        // Bulut resmini yükler
        this.loadImage('image/5_background/layers/4_clouds/1.png');

        // Bulutun başlangıç konumu (rasgele bir x değeri)
        this.x =  Math.random() * 500;

        // Bulutun hareket etmesini başlatır
        this.animate();
    }

    // Bulutu sürekli sola doğru kaydıran fonksiyon
animate() {
    setInterval(() => {
        this.moveLeft();
    }, 1000 / 60);
}

  
}
