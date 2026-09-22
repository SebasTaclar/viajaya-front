<template>
  <div class="destinations" id="destinos">
    <div class="destinations__intro">
      <div>
        <p class="destinations__eyebrow">UNA COLECCIÓN DE POSIBILIDADES</p>
        <h2>Descubre <em><br />el mundo</em></h2>
      </div>
      <p>
        Encuentra el plan perfecto para tus próximas vacaciones y táchalo de tu lista.
      </p>
    </div>

    <div class="destinations__grid">
      <TravelPackageCard
        v-for="(pkg, index) in packages"
        :key="pkg.name"
        :pkg="pkg"
        :index="index"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import TravelPackageCard from './TravelPackageCard.vue'

defineOptions({ name: 'TravelDestinations' })

const packages = [
  {
    name: 'Aventuras',
    region: 'Rutas Imperdibles',
    tag: 'Aventura Total',
    price: '$1.290.000',
    alt: 'Senderismo en la Ciudad Perdida',
    image: 'https://travelgrafia.co/wp-content/uploads/2022/06/Tour-a-Ciudad-Perdida-desde-Santa-Marta.jpg',
    imageHover: 'https://i.pinimg.com/474x/54/0d/15/540d15b310655c286cc80fe90b69f444.jpg',
    benefits: [
      { label: 'Vuelos', icon: 'fas fa-plane' },
      { label: 'Hotel', icon: 'fas fa-bed' },
      { label: 'Tour', icon: 'fas fa-map-marker-alt' }
    ]
  },
  {
    name: 'Playas',
    region: 'Sol y Arena',
    tag: 'Paraíso Tropical',
    price: '$980.000',
    alt: 'Playa tropical en Colombia',
    image: 'https://media.istockphoto.com/id/1266305627/es/foto/playa-en-santa-marta-colombia.jpg?s=612x612&w=0&k=20&c=OgocAqEulDhMJW_R7YnHLAYUHmNUEml_lDFxJ4VP-OM=',
    imageHover: 'https://i.pinimg.com/736x/41/8f/88/418f88956165641b2ecc8a956ac3105d.jpg',
    benefits: [
      { label: 'Vuelos', icon: 'fas fa-plane' },
      { label: 'Hotel', icon: 'fas fa-bed' },
      { label: 'Alimentación', icon: 'fas fa-utensils' }
    ]
  },
  {
    name: 'Ciudades',
    region: 'Tesoros Urbanos',
    tag: 'Cultura y Estilo',
    price: '$4.890.000',
    alt: 'Ciudades europeas con encanto',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxlV3V8-Xz7aENxAErBY2G__YbRUvQcxTga4Q_Lv2ngA&s=10',
    imageHover: 'https://thumbs.dreamstime.com/b/collage-europeo-de-la-ciudad-36062908.jpg',
    benefits: [
      { label: 'Vuelos', icon: 'fas fa-plane' },
      { label: 'Hotel', icon: 'fas fa-bed' },
      { label: 'Guía', icon: 'fas fa-compass' }
    ]
  },
  {
    name: 'Culturas',
    region: 'Tradiciones Vivas',
    tag: 'Experiencias Únicas',
    price: '$760.000',
    alt: 'Festival de tradiciones colombianas',
    image: 'https://img.magnific.com/fotos-premium/personas-bailando-trajes-tradicionales-colombianos-calle_1127009-17958.jpg?semt=ais_hybrid&w=740&q=80',
    imageHover: 'https://img.magnific.com/fotos-premium/grupo-personas-coloridas-ropas-tradicionales-mexicanas-bailando-tocando-musica-playa_14117-345730.jpg?semt=ais_hybrid&w=740&q=80',
    benefits: [
      { label: 'Hotel', icon: 'fas fa-bed' },
      { label: 'Alimentación', icon: 'fas fa-utensils' },
      { label: 'Tour', icon: 'fas fa-map-marker-alt' }
    ]
  }
]
</script>

<style scoped>
.destinations {
  display: grid;
  grid-template-columns: minmax(280px, 0.7fr) minmax(0, 1.3fr);
  column-gap: clamp(28px, 5vw, 72px);
  max-width: 1440px;
  margin: 0 auto;
  padding: 350px clamp(24px, 6vw, 84px) 180px;
  background: transparent;
  border-bottom: none;
}

.destinations__intro {
  display: block;
  align-self: start;
  padding-top: 26px;
  margin-bottom: 44px;
}

.destinations__eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 14px;
  color: #16c2ca;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 2px;
  white-space: nowrap;
}

.destinations__eyebrow::before {
  width: 28px;
  height: 2px;
  flex: 0 0 28px;
  background: #16c2ca;
  content: '';
}

.destinations h2 {
  margin: 0;
  color: #fff;
  font-family: 'VolkSans', sans-serif;
  font-size: clamp(52px, 7vw, 92px);
  font-weight: 400;
  line-height: 0.92;
  letter-spacing: 2px;
  text-transform: uppercase;
  white-space: nowrap;
  letter-spacing: -0.01em;
}

.destinations h2 em {
  color: #F51668;
  font-style: normal;
}

.destinations__intro > p:last-child {
  max-width: 560px;
  margin: 24px 0 4px;
  color: #c0c4d0;
  font-size: 15px;
  line-height: 1.7;
}

.destinations__grid {
  align-self: start;
  justify-self: end;
  display: grid;
  width: min(100%, 560px);
  grid-template-columns: repeat(2, minmax(120px, 220px));
  justify-content: end;
  gap: clamp(16px, 2.5vw, 36px);
  margin-top: -170px;
  padding: 28px 0 20px;
}

@media (max-width: 800px) {
  .destinations {
    display: block;
    padding: 80px clamp(20px, 5vw, 40px) 80px;
  }

  .destinations__intro {
    margin-bottom: 32px;
  }

  .destinations h2 {
    white-space: normal;
    font-size: clamp(36px, 9vw, 60px);
  }

  .destinations__eyebrow {
    white-space: normal;
  }

  .destinations__intro > p:last-child {
    font-size: 14px;
  }

  .destinations__grid {
    width: 100%;
    grid-template-columns: repeat(2, 1fr);
    margin-top: 0;
    padding: 0;
    gap: 16px;
  }
}

@media (max-width: 520px) {
  .destinations {
    padding: 48px 16px;
  }

  .destinations h2 {
    font-size: clamp(32px, 10vw, 48px);
  }

  .destinations__intro > p:last-child {
    font-size: 13px;
  }

  .destinations__grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }
}
</style>
