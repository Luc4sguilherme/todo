<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg bg-dark mb-2">
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarToggler"
        aria-controls="navbarToggler"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="text-white">
          <i class="fas fa-bars"></i>
        </span>
      </button>
      <a class="navbar-brand text-white" href="#">
        {{ titulo }}
      </a>

      <div class="collapse navbar-collapse" id="navbarToggler">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" to="/"
              ><i class="far fa-check-circle"></i
              ><span class="ml-3">Tarefas</span></router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/clientes"
              ><i class="far fa-user"></i
              ><span class="ml-3">Clientes</span></router-link
            >
          </li>

          <li class="nav-item">
            <router-link class="nav-link" to="/notas"
              ><i class="far fa-sticky-note"></i
              ><span class="ml-3">Notas</span></router-link
            >
          </li>
        </ul>
      </div>
    </nav>
    <div class="container-fluid">
      <router-view />
    </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return { titulo: "Painel de controle" };
  },
  watch: {
    $route(to, from) {
      document.title = to.meta.title || "Painel de controle";
      this.titulo = to.meta.title;
    }
  }
};
</script>
<style lang="scss">
@import "./assets/scss/custom.scss";
@import "./assets/scss/variables";
@import "bootstrap/scss/bootstrap";
@import "./assets/scss/bootswatch";
</style>
