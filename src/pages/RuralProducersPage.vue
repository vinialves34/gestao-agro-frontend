<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ruralProducerApi } from "../services/api";
import type { RuralProducer } from "../models/RuralProducer";
import type { IPaginationData } from "../services/interfaces/IPaginationData";
import {
  Button,
  Column,
  DataTable,
  Dialog,
  FloatLabel,
  InputMask,
  InputText,
} from "primevue";
import { Sweetalert, ToastAlert } from "../utils/sweetalertUtils";
import "primeicons/primeicons.css";

interface FilterParams {
  paginate: number;
  page: number;
  perPage: number;
  filters: {
    name: string;
    cpf_cnpj: string;
    phone: string;
    email: string;
    address: string;
  };
}

const ruralProducers = ref<RuralProducer[]>([]);
const paginationData = ref<IPaginationData>();
const dialogTitle = ref("");
const dialog = ref(false);
const editing = ref(false);
const loading = ref(false);
let timeout = 0;
const filterParams = ref<FilterParams>({
  paginate: 1,
  page: 1,
  perPage: 10,
  filters: {
    name: "",
    cpf_cnpj: "",
    phone: "",
    email: "",
    address: "",
  },
});

const form = ref<RuralProducer>({
  name: "",
  email: "",
  phone: "",
  address: "",
  cpf_cnpj: "",
});

const loadRuralProducers = async () => {
  loading.value = true;

  const params = {
    paginate: filterParams.value.paginate,
    page: filterParams.value.page,
    perPage: filterParams.value.perPage,
    ...filterParams.value.filters,
  };

  try {
    const { data: res } = await ruralProducerApi.getAll(params);

    ruralProducers.value = res.data.data;
    paginationData.value = {
      current_page: res.data.current_page,
      last_page: res.data.last_page,
      per_page: res.data.per_page,
      total: res.data.total,
      links: res.data.links,
    };
  } finally {
    loading.value = false;
  }
};

const saveRuralProducer = async () => {
  if (validateForm()) {
    if (editing.value && form.value.id) {
      await ruralProducerApi.update(form.value.id, form.value);
      ToastAlert.fire(
        "Atualizado!",
        "O produtor rural foi atualizado.",
        "success",
      );
    } else {
      await ruralProducerApi.create(form.value);
      ToastAlert.fire("Criado!", "O produtor rural foi criado.", "success");
    }

    dialog.value = false;
    resetForm();
    loadRuralProducers();
  }
};

const editRuralProducer = (producer: RuralProducer) => {
  form.value = { ...producer };
  editing.value = true;
  dialog.value = true;
  dialogTitle.value = "Editar Produtor Rural";
};

const removeRuralProducer = async (id: number) => {
  await ruralProducerApi.delete(id);
  loadRuralProducers();
};

const resetForm = () => {
  form.value = {
    name: "",
    email: "",
    phone: "",
    address: "",
    cpf_cnpj: "",
  };
  editing.value = false;
};

const confirmDelete = (id: number) => {
  Sweetalert.fire({
    title: "Confirmação de Exclusão",
    text: "Tem certeza de que deseja excluir este produtor rural?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sim, excluir",
    cancelButtonText: "Cancelar",
    customClass: {
      confirmButton: "p-button p-component p-button-danger",
      cancelButton: "p-button p-component p-button-secondary",
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      await removeRuralProducer(id);
      ToastAlert.fire("Excluído!", "O produtor rural foi excluído.", "success");
    }
  });
};

const onPage = (event: any) => {
  filterParams.value.page = event.page + 1;
  filterParams.value.perPage = event.rows;

  loadRuralProducers();
};

const onFilter = () => {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    filterParams.value.page = 1;
    loadRuralProducers();
  }, 500);
};

const validateForm = () => {
  const requiredFields: Record<string, any> = {
    ["CPF/CNPJ"]: form.value.cpf_cnpj,
    ["Nome"]: form.value.name,
    ["E-mail"]: form.value.email,
    ["Telefone"]: form.value.phone,
    ["Endereço"]: form.value.address,
  };
  let listFields = "";

  for (const field in requiredFields) {
    if (!requiredFields[field]) {
      listFields += `<li>"${field}"</li>`;
    }
  }

  ToastAlert.fire(
    "Atenção!",
    `<div>
      <p style="font-weight: bold;">Os campos são obrigatórios:</p>
      <ul>${listFields}</ul>
    </div>`,
    "warning",
  );

  return !listFields.length;
};

onMounted(loadRuralProducers);
</script>

<template>
  <section class="max-w-full mx-auto px-4 my-8 sm:px-6 lg:px-8">
    <h2 class="text-2xl font-bold text-green-700">Produtores Rurais</h2>

    <div class="flex flex-row-reverse my-4">
      <Button
        label="Novo"
        icon="pi pi-plus"
        @click="
          ((dialog = true), (dialogTitle = 'Novo Produtor Rural'), resetForm())
        "
      />
    </div>

    <div class="rounded-lg shadow-sm">
      <DataTable
        stripedRows
        :value="ruralProducers"
        :lazy="true"
        :paginator="true"
        :rows="filterParams.perPage"
        :totalRecords="paginationData?.total"
        :loading="loading"
        @page="onPage"
        filterDisplay="row"
        tableStyle="min-width: 50rem"
      >
        <Column field="name" header="Nome">
          <template #body="{ data }">
            {{ data.name }}
          </template>
          <template #filter="{}">
            <InputText
              v-model="filterParams.filters.name"
              type="text"
              @input="onFilter()"
              placeholder="Buscar pelo nome"
            />
          </template>
        </Column>
        <Column field="cpf_cnpj" header="CPF/CNPJ">
          <template #body="{ data }">
            {{ data.cpf_cnpj }}
          </template>
          <template #filter="{}">
            <InputText
              v-model="filterParams.filters.cpf_cnpj"
              type="text"
              @input="onFilter()"
              placeholder="Buscar pelo CPF/CNPJ"
            />
          </template>
        </Column>
        <Column field="email" header="Email">
          <template #body="{ data }">
            {{ data.email }}
          </template>
          <template #filter="{}">
            <InputText
              v-model="filterParams.filters.email"
              type="text"
              @input="onFilter()"
              placeholder="Buscar pelo e-mail"
            />
          </template>
        </Column>
        <Column field="phone" header="Telefone">
          <template #body="{ data }">
            {{ data.phone }}
          </template>
          <template #filter="{}">
            <InputText
              v-model="filterParams.filters.phone"
              type="text"
              @input="onFilter()"
              placeholder="Buscar pelo telefone"
            />
          </template>
        </Column>
        <Column field="address" header="Endereço">
          <template #body="{ data }">
            {{ data.address }}
          </template>
          <template #filter="{}">
            <InputText
              v-model="filterParams.filters.address"
              type="text"
              @input="onFilter()"
              placeholder="Buscar pelo endereço"
            />
          </template>
        </Column>

        <Column header="Ações">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button
                v-tooltip.bottom="'Editar'"
                icon="pi pi-pencil"
                @click="editRuralProducer(slotProps.data)"
              />
              <Button
                v-tooltip.bottom="'Excluir'"
                icon="pi pi-trash"
                severity="danger"
                @click="confirmDelete(slotProps.data.id)"
              />
            </div>
          </template>
        </Column>

        <template #empty>
          <div class="flex justify-center p-2">
            <span class="text-gray-500">Nenhum registro encontrado.</span>
          </div>
        </template>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="dialog"
      :header="dialogTitle"
      :pt="{ content: 'flex flex-col gap-4' }"
    >
      <FloatLabel variant="in">
        <InputText id="cpf_cnpj" v-model="form.cpf_cnpj" class="w-full" />
        <label for="cpf_cnpj">CPF/CNPJ</label>
      </FloatLabel>
      <FloatLabel variant="in">
        <InputText id="nome" v-model="form.name" class="w-full" />
        <label for="nome">Nome</label>
      </FloatLabel>
      <FloatLabel variant="in">
        <InputText id="email" v-model="form.email" class="w-full" />
        <label for="email">E-mail</label>
      </FloatLabel>
      <FloatLabel variant="in">
        <InputMask
          id="telefone"
          v-model="form.phone"
          mask="(99) 99999-9999"
          class="w-full"
        />
        <label for="telefone">Telefone</label>
      </FloatLabel>
      <FloatLabel variant="in">
        <InputText id="endereco" v-model="form.address" class="w-full" />
        <label for="endereco">Endereço</label>
      </FloatLabel>

      <Button label="Salvar" icon="pi pi-save" @click="saveRuralProducer" />
    </Dialog>
  </section>
</template>
