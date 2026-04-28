<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Herd } from "../models/Herd";
import type { IPaginationData } from "../services/interfaces/IPaginationData";
import type { Property } from "../models/Property";
import type { Specie } from "../models/Specie";
import { herdApi, propertyApi, reportApi, specieApi } from "../services/api";
import {
  Button,
  Column,
  DataTable,
  Dialog,
  FloatLabel,
  InputNumber,
  InputText,
  Select,
} from "primevue";
import { Sweetalert, ToastAlert } from "../utils/sweetalertUtils";
import "primeicons/primeicons.css";

interface FilterParams {
  paginate: number;
  page: number;
  perPage: number;
  filters: {
    property_name: string;
    specie_name: string;
    purpose: string;
    quantity: string;
  };
}

const herds = ref<Herd[]>([]);
const properties = ref<Property[]>([]);
const species = ref<Specie[]>([]);
const paginationData = ref<IPaginationData>();
const selectedProperty = ref();
const selectedSpecie = ref();
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
    property_name: "",
    specie_name: "",
    quantity: "",
    purpose: "",
  },
});

const form = ref<Herd>({
  property_id: null,
  species_id: null,
  quantity: null,
  purpose: "",
});

const validateForm = () => {
  const requiredFields: Record<string, any> = {
    ["Quantidade"]: form.value.quantity,
    ["Espécie"]: form.value.species_id,
    ["Propriedade"]: form.value.property_id,
    ["Finalidade"]: form.value.purpose,
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

const resetForm = () => {
  form.value = {
    property_id: null,
    species_id: null,
    quantity: null,
    purpose: "",
  };
  selectedProperty.value = ref();
  selectedSpecie.value = ref();
  editing.value = false;
};

const loadHerds = async () => {
  loading.value = true;

  const params = {
    paginate: filterParams.value.paginate,
    page: filterParams.value.page,
    perPage: filterParams.value.perPage,
    ...filterParams.value.filters,
  };

  try {
    const { data: res } = await herdApi.getAll(params);

    herds.value = res.data.data;
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

const loadProperties = async () => {
  const response = await propertyApi.getAll();
  properties.value = response.data.data;
};

const loadSpecies = async () => {
  const response = await specieApi.getAll();
  species.value = response.data.data;
};

const removeProperty = async (id: number) => {
  await herdApi.delete(id);
  loadHerds();
};

const confirmDelete = (id: number) => {
  Sweetalert.fire({
    title: "Confirmação de Exclusão",
    text: "Tem certeza de que deseja excluir este rebanho?",
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
      ToastAlert.fire("Excluído!", "A rebanho foi excluída.", "success");
    }
  });
};

const editHerd = async (herd: Herd) => {
  form.value = { ...herd };
  selectedProperty.value = herd.property_id;
  selectedSpecie.value = herd.species_id;

  editing.value = true;
  dialog.value = true;
  dialogTitle.value = "Editar Rebanho";
};

const saveHerd = async () => {
  form.value.property_id = selectedProperty.value
    ? selectedProperty.value
    : null;
  form.value.species_id = selectedSpecie.value ? selectedSpecie.value : null;

  if (validateForm()) {
    if (editing.value && form.value.id) {
      await herdApi.update(form.value.id, form.value);
      ToastAlert.fire("Atualizado!", "A rebanho foi atualizada.", "success");
    } else {
      if (validateForm()) {
        await herdApi.create(form.value);
        ToastAlert.fire("Criado!", "A rebanho foi criada.", "success");
      }
    }

    dialog.value = false;
    resetForm();
    loadHerds();
  }
};

const onPage = (event: any) => {
  filterParams.value.page = event.page + 1;
  filterParams.value.perPage = event.rows;

  loadHerds();
};

const onFilter = () => {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    filterParams.value.page = 1;
    loadHerds();
  }, 500);
};

const downloadReport = () => {
  return reportApi.downloadHerdReport();
}

onMounted(() => {
  loadHerds();
  loadProperties();
  loadSpecies();
});
</script>

<template>
  <section class="max-w-full mx-auto px-4 my-8 sm:px-6 lg:px-8">
    <div class="flex justify-between my-4">
      <h2 class="flex flex-col justify-center text-2xl font-bold text-green-700">Rebanhos</h2>
      <div class="flex gap-2">
        <Button
          label="Novo"
          icon="pi pi-plus"
          @click="((dialog = true), (dialogTitle = 'Novo Rebanho'), resetForm())"
          raised
        />
        <Button
          label="Relatório"
          icon="pi pi-file-export"
          severity="warn"
          as="a"
          :href="downloadReport()"
          target="_blank"
          raised
        />
      </div>
    </div>

    <div class="rounded-lg shadow-sm">
      <DataTable
        stripedRows
        :value="herds"
        :lazy="true"
        :paginator="true"
        :rows="filterParams.perPage"
        :totalRecords="paginationData?.total"
        :loading="loading"
        @page="onPage"
        filterDisplay="row"
        tableStyle="min-width: 50rem"
      >
        <Column field="property.name" header="Propriedade">
          <template #body="{ data }">
            {{ data.property.name }}
          </template>
          <template #filter="{}">
            <InputText
              v-model="filterParams.filters.property_name"
              type="text"
              @input="onFilter()"
              placeholder="Buscar pela propriedade"
            />
          </template>
        </Column>
        <Column field="species.name" header="Espécie">
          <template #body="{ data }">
            {{ data.species.name }}
          </template>
          <template #filter="{}">
            <InputText
              v-model="filterParams.filters.specie_name"
              type="text"
              @input="onFilter()"
              placeholder="Buscar pela espécie"
            />
          </template>
        </Column>
        <Column field="quantity" header="Quantidade">
          <template #body="{ data }">
            {{ data.quantity }}
          </template>
          <template #filter="{}">
            <InputText
              v-model="filterParams.filters.quantity"
              type="text"
              @input="onFilter()"
              placeholder="Buscar pela quantidade"
            />
          </template>
        </Column>
        <Column field="purpose" header="Finalidade">
          <template #body="{ data }">
            {{ data.purpose }}
          </template>
          <template #filter="{}">
            <InputText
              v-model="filterParams.filters.purpose"
              type="text"
              @input="onFilter()"
              placeholder="Buscar pelo finalidade"
            />
          </template>
        </Column>

        <Column header="Ações">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button
                v-tooltip.bottom="'Editar'"
                icon="pi pi-pencil"
                @click="editHerd(slotProps.data)"
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
        <Select
          id="propriedade"
          v-model="selectedProperty"
          editable
          :options="properties"
          optionLabel="name"
          optionValue="id"
          class="w-full"
          empty-message="Nenhum registro encontrado"
        />
        <label for="propriedade">Propriedade</label>
      </FloatLabel>
      <FloatLabel variant="in">
        <Select
          id="especie"
          v-model="selectedSpecie"
          editable
          :options="species"
          optionLabel="name"
          optionValue="id"
          class="w-full"
          empty-message="Nenhum registro encontrado"
        />
        <label for="especie">Espécie</label>
      </FloatLabel>
      <FloatLabel variant="in">
        <InputNumber
          id="quantidade"
          v-model="form.quantity"
          required
          class="w-full"
        />
        <label for="quantidade">Quantidade</label>
      </FloatLabel>
      <FloatLabel variant="in">
        <InputText id="finalidade" v-model="form.purpose" class="w-full" />
        <label for="finalidade">Finalidade</label>
      </FloatLabel>

      <Button label="Salvar" icon="pi pi-save" @click="saveHerd" />
    </Dialog>
  </section>
</template>
