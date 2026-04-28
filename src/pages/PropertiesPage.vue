<script setup lang="ts">
import { ref, onMounted } from "vue";
import { propertyApi, ruralProducerApi } from "../services/api";
import type { Property } from "../models/Property";
import type { IPaginationData } from "../services/interfaces/IPaginationData";
import {
  Button,
  Column,
  DataTable,
  Dialog,
  FloatLabel,
  InputText,
  Select,
} from "primevue";
import { Sweetalert, ToastAlert } from "../utils/sweetalertUtils";
import "primeicons/primeicons.css";
import { ibgeApi } from "../services/ibge-api";
import type { RuralProducer } from "../models/RuralProducer";

interface FilterParams {
  paginate: number;
  page: number;
  perPage: number;
  filters: {
    name: string;
    city: string;
    state: string;
    state_registration: string;
    total_area: string;
    rural_producer_name: string;
  };
}

const properties = ref<Property[]>([]);
const ruralProducers = ref<RuralProducer[]>([]);
const paginationData = ref<IPaginationData>();
const states = ref([]);
const cities = ref([]);
const selectedState = ref("");
const selectedCity = ref("");
const selectedRuralProducer = ref();
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
    city: "",
    state: "",
    state_registration: "",
    total_area: "",
    rural_producer_name: "",
  },
});

const form = ref<Property>({
  name: "",
  city: "",
  state: "",
  total_area: "",
  state_registration: "",
  producer_id: null,
});

const loadProperties = async () => {
  loading.value = true;

  const params = {
    paginate: filterParams.value.paginate,
    page: filterParams.value.page,
    perPage: filterParams.value.perPage,
    ...filterParams.value.filters,
  };

  try {
    const { data: res } = await propertyApi.getAll(params);

    properties.value = res.data.data;
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

const loadStates = async () => {
  const response = await ibgeApi.getStates();
  states.value = response.data;
};

const loadCities = async () => {
  const response = await ibgeApi.getCitiesByState(selectedState.value);
  cities.value = response.data;
};

const loadRuralProducers = async () => {
  const response = await ruralProducerApi.getAll();
  ruralProducers.value = response.data.data;
};

const saveProperty = async () => {
  form.value.state = selectedState.value ? selectedState.value : "";
  form.value.city = selectedCity.value ? selectedCity.value : "";

  form.value.producer_id = selectedRuralProducer.value
    ? selectedRuralProducer.value.id
    : null;

  if (validateForm()) {
    if (editing.value && form.value.id) {
      await propertyApi.update(form.value.id, form.value);
      ToastAlert.fire(
        "Atualizado!",
        "A propriedade foi atualizada.",
        "success",
      );
    } else {
      await propertyApi.create(form.value);
      ToastAlert.fire("Criado!", "A propriedade foi criada.", "success");
    }

    dialog.value = false;
    resetForm();
    loadProperties();
  }
};

const editProperty = async (property: Property) => {
  form.value = { ...property };
  selectedState.value = property.state;

  await loadCities();
  selectedCity.value = property.city;

  selectedRuralProducer.value = ruralProducers.value.find(
    (ruralProducer: any) => ruralProducer.id === property.producer_id,
  );

  editing.value = true;
  dialog.value = true;
  dialogTitle.value = "Editar Propriedade";
};

const removeProperty = async (id: number) => {
  await propertyApi.delete(id);
  loadProperties();
};

const resetForm = () => {
  form.value = {
    name: "",
    city: "",
    state: "",
    total_area: "",
    state_registration: "",
    producer_id: null,
  };
  selectedState.value = "";
  selectedCity.value = "";
  selectedRuralProducer.value = ref();
  editing.value = false;
};

const confirmDelete = (id: number) => {
  Sweetalert.fire({
    title: "Confirmação de Exclusão",
    text: "Tem certeza de que deseja excluir esta propriedade?",
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
      await removeProperty(id);
      ToastAlert.fire("Excluído!", "A propriedade foi excluída.", "success");
    }
  });
};

const onPage = (event: any) => {
  filterParams.value.page = event.page + 1;
  filterParams.value.perPage = event.rows;

  loadProperties();
};

const onFilter = () => {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    filterParams.value.page = 1;
    loadProperties();
  }, 500);
};

const validateForm = () => {
  const requiredFields: Record<string, any> = {
    ["Nome"]: form.value.name,
    ["Produtor rural"]: form.value.producer_id,
    ["Estado"]: form.value.state,
    ["Cidade"]: form.value.city,
    ["Inscrição estadual"]: form.value.state_registration,
    ["Área total"]: form.value.total_area,
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

onMounted(() => {
  loadProperties();
  loadStates();
  loadRuralProducers();
});
</script>

<template>
  <section class="max-w-full mx-auto px-4 my-8 sm:px-6 lg:px-8">
    <div class="flex justify-between my-4">
      <h2 class="flex flex-col justify-center text-2xl font-bold text-green-700">Propriedades</h2>

      <div class="flex gap-2">
        <Button
          label="Novo"
          icon="pi pi-plus"
          @click="
            ((dialog = true), (dialogTitle = 'Nova Propriedade'), resetForm())
          "
          raised
        />
        <Button
          label="Relatório"
          icon="pi pi-file-export"
          @click=""
          severity="warn"
          raised
        />
      </div>
    </div>

    <div class="rounded-lg shadow-sm">
      <DataTable
        stripedRows
        :value="properties"
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
        <Column field="city" header="Município">
          <template #body="{ data }">
            {{ data.city }}
          </template>
          <template #filter="{}">
            <InputText
              v-model="filterParams.filters.city"
              type="text"
              @input="onFilter()"
              placeholder="Buscar pelo município"
            />
          </template>
        </Column>
        <Column field="state" header="Estado">
          <template #body="{ data }">
            {{ data.state }}
          </template>
          <template #filter="{}">
            <InputText
              v-model="filterParams.filters.state"
              type="text"
              @input="onFilter()"
              placeholder="Buscar pelo estado"
            />
          </template>
        </Column>
        <Column field="total_area" header="Área Total">
          <template #body="{ data }"> {{ data.total_area }} m² </template>
          <template #filter="{}">
            <InputText
              v-model="filterParams.filters.total_area"
              type="text"
              @input="onFilter()"
              placeholder="Buscar pela área total"
            />
          </template>
        </Column>
        <Column field="state_registration" header="Inscrição Estadual">
          <template #body="{ data }">
            {{ data.state_registration }}
          </template>
          <template #filter="{}">
            <InputText
              v-model="filterParams.filters.state_registration"
              type="text"
              @input="onFilter()"
              placeholder="Buscar pela inscrição"
            />
          </template>
        </Column>
        <Column field="rural_producer.name" header="Proprietário">
          <template #body="{ data }">
            {{ data.rural_producer.name }}
          </template>
          <template #filter="{}">
            <InputText
              v-model="filterParams.filters.rural_producer_name"
              type="text"
              @input="onFilter()"
              placeholder="Buscar pelo proprietário"
            />
          </template>
        </Column>

        <Column header="Ações">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button
                v-tooltip.bottom="'Editar'"
                icon="pi pi-pencil"
                @click="editProperty(slotProps.data)"
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
        <InputText id="nome" v-model="form.name" class="w-full" />
        <label for="nome">Nome da propriedade</label>
      </FloatLabel>
      <FloatLabel variant="in">
        <Select
          id="produtor_rural"
          v-model="selectedRuralProducer"
          @change="loadRuralProducers()"
          editable
          :options="ruralProducers"
          optionLabel="name"
          class="w-full"
          empty-message="Nenhum registro encontrado"
        />
        <label for="produtor_rural">Proprietário</label>
      </FloatLabel>
      <FloatLabel variant="in">
        <Select
          id="estado"
          v-model="selectedState"
          @change="
            () => {
              loadCities();
            }
          "
          editable
          :options="states"
          optionLabel="nome"
          optionValue="sigla"
          class="w-full"
          empty-message="Nenhum registro encontrado"
        />
        <label for="estado">Estado</label>
      </FloatLabel>
      <FloatLabel variant="in">
        <Select
          id="municipio"
          v-model="selectedCity"
          editable
          :options="cities"
          optionLabel="municipio-nome"
          optionValue="municipio-nome"
          :disabled="!selectedState.length"
          class="w-full"
          empty-message="Nenhum registro encontrado"
        />
        <label for="municipio">Município</label>
      </FloatLabel>
      <FloatLabel variant="in">
        <InputText
          id="area_total"
          v-model="form.total_area"
          type="number"
          class="w-full"
        />
        <label for="area_total">Área Total (m²)</label>
      </FloatLabel>
      <FloatLabel variant="in">
        <InputText
          id="inscricao_estadual"
          v-model="form.state_registration"
          class="w-full"
        />
        <label for="inscricao_estadual">Inscrição Estadual</label>
      </FloatLabel>
      <Button label="Salvar" icon="pi pi-save" @click="saveProperty" />
    </Dialog>
  </section>
</template>
