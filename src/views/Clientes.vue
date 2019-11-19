<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12" id="accordion">
        <div class="card">
          <div class="card-header" id="headingOne">
            <h1 class="h6">
              <button
                class="btn btn-link"
                data-toggle="collapse"
                data-target="#collapseOne"
                aria-expanded="false"
                aria-controls="collapseOne"
              >
                CLIENTE
              </button>
            </h1>
          </div>
          <div
            id="collapseOne"
            class="collapse"
            aria-labelledby="headingOne"
            data-parent="#accordion"
          >
            <div class="card-body">
              <div class="form-group m-0">
                <label>id</label>
                <input
                  class="form-control"
                  v-model="novoCliente.clienteId"
                  type="number"
                  placeholder="ex: 169"
                />
              </div>
              <div class="form-group m-0">
                <label>Nome</label>
                <textarea
                  class="form-control"
                  v-model="novoCliente.nome"
                  rows="1"
                ></textarea>
              </div>
              <div class="form-group">
                <label>Plano</label>
                <select class="form-control" v-model="novoCliente.plano">
                  <option
                    :value="{
                      id: '1',
                      nome: 'INICIAL'
                    }"
                    >INICIAL</option
                  >
                  <option
                    :value="{
                      id: '2',
                      nome: 'INTERMEDIARIO'
                    }"
                    >INTERMEDIARIO</option
                  >
                  <option
                    :value="{
                      id: '3',
                      nome: 'COMPLETO'
                    }"
                    >COMPLETO</option
                  >
                  <option
                    :value="{
                      id: '10',
                      nome: 'inativo'
                    }"
                    >inativo</option
                  >
                </select>
              </div>
              <div class="form-group">
                <label>Status</label>
                <select class="form-control" v-model="novoCliente.status">
                  <option :value="'ativo'">ativo</option>
                  <option :value="'inativo'">inativo</option>
                </select>
              </div>
              <button
                :disabled="!novoCliente.clienteId"
                class="btn btn-primary btn-block"
                type="button"
                v-on:click="criarCliente()"
              >
                SALVAR
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 pt-2">
        <table class="table table-dark">
          <thead>
            <tr>
              <th scope="col">id</th>
              <th scope="col">Nome</th>
              <th scope="col">Plano</th>
              <th scope="col">Status</th>
              <th scope="col">Editar</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="cliente in clientes"
              v-show="cliente.clienteId > 100"
              :key="cliente.key"
              :class="{
                'table-info': cliente.plano === 'COMPLETO',
                'table-success': cliente.plano === 'INTERMEDIARIO',
                'table-primary': cliente.plano === 'INICIAL',
                'table-warning': cliente.plano === 'inativo'
              }"
            >
              <th scope="row">{{ cliente.clienteId }}</th>
              <td>{{ cliente.nome }}</td>
              <td>{{ cliente.plano }}</td>
              <td>{{ cliente.status }}</td>
              <td>
                <button
                  v-on:click="
                    editarCliente(
                      cliente.clienteId,
                      cliente.nome,
                      cliente.plano,
                      cliente.planoId,
                      cliente.status
                    )
                  "
                  class="btn btn-sm btn-outline-white"
                >
                  editar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "../data";
export default {
  name: "clientes",
  data: function() {
    return {
      db_clientes: [],
      tarefas: "",
      filtros: {
        status: "",
        cliente: "",
        plano: ""
      },
      novoCliente: {
        clienteId: "",
        nome: "",
        plano: {
          id: "",
          nome: ""
        },
        status: "ativo"
      }
    };
  },
  methods: {
    limparCliente: function() {
      this.novoCliente = {
        clienteId: "",
        nome: "",
        plano: {
          id: "",
          nome: ""
        },
        status: "ativo",
        botao: true
      };
    },

    criarCliente: function() {
      db.ref(`clientes/${this.novoCliente.clienteId}`).set({
        clienteId: this.novoCliente.clienteId,
        nome: this.novoCliente.nome,
        plano: this.novoCliente.plano.nome,
        planoId: this.novoCliente.plano.id,
        status: "ativo"
      });
      this.limparCliente();
    },
    editarCliente: function(clienteId, nome, plano, planoId, status) {
      this.novoCliente.clienteId = clienteId;
      this.novoCliente.nome = nome;
      this.novoCliente.plano.nome = plano;
      this.novoCliente.plano.id = planoId;
      this.novoCliente.status = status;
    }
  },
  computed: {
    clientes: function() {
      let clients = this.db_clientes;
      let vm = this;
      if (this.filtros.status) {
        clients = clients.filter(function(client) {
          return clients.status === vm.filtros.status;
        });
      }
      if (this.filtros.cliente) {
        clients = clients.filter(function(client) {
          return client.clienteId === vm.filtros.cliente;
        });
      }
      if (this.filtros.plano) {
        clients = clients.filter(function(client) {
          return client.plano === vm.filtros.plano;
        });
      }

      clients = clients.sort(function(a, b) {
        var keyA = a.planoId,
          keyB = b.planoId;
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });
      return clients;
    }
  },
  firebase: {
    tarefas: db.ref("tarefas"),
    db_clientes: db.ref("clientes"),
    colabs: db.ref("colab")
  }
};
</script>
