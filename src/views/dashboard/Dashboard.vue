<template>
  <div>
    <WidgetsStatsA class="mb-4" />
    <CRow>
      <CCol :md="12">
       
      </CCol>
    </CRow>
    <CRow>
      <CCol :md="6">
        <CCard class="mb-4">
          <CCardBody>
            <br />

            <div>
              <h5 class="mb-3">Top 5 Pengajuan Aset</h5>

              <div v-if="loading" class="text-center py-3">
                <CSpinner color="primary" />
              </div>

              <CTable v-else align="middle" class="mb-0 border" hover responsive>
                <CTableHead class="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell class="bg-body-secondary text-center">#</CTableHeaderCell>
                    <CTableHeaderCell class="bg-body-secondary">Pengaju</CTableHeaderCell>
                    <CTableHeaderCell class="bg-body-secondary">Tanggal Pengajuan</CTableHeaderCell>
                    <CTableHeaderCell class="bg-body-secondary">Lokasi/Departemen</CTableHeaderCell>
                    <CTableHeaderCell class="bg-body-secondary">Jenis Pengajuan</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow v-for="(item, index) in submissions" :key="item.submissionId">
                    <CTableDataCell class="text-center">{{ index + 1 }}</CTableDataCell>
                    <CTableDataCell>
                      <div>{{ item.submissionName }}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      {{ new Date(item.submissionDate).toLocaleDateString('id-ID') }}
                    </CTableDataCell>
                    <CTableDataCell>
                      {{ item.submissionOutlet }} / {{ item.submissionArea }}
                    </CTableDataCell>
                    <CTableDataCell>
                      {{ item.submissionCategory }}
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol :md="6">
        <CCard class="mb-4">
          <CCardBody>
            <br />

            <div>
              <h5 class="mb-3">Top 5 Pengajuan Perkap</h5>

              <div v-if="loadingParent" class="text-center py-3">
                <CSpinner color="primary" />
              </div>

              <CTable v-else align="middle" class="mb-0 border" hover responsive>
                <CTableHead class="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell class="bg-body-secondary text-center">#</CTableHeaderCell>
                    <CTableHeaderCell class="bg-body-secondary">Lokasi/Departemen</CTableHeaderCell>
                    <CTableHeaderCell class="bg-body-secondary">Area Kerja</CTableHeaderCell>
                    <CTableHeaderCell class="bg-body-secondary">Tanggal Pengajuan</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow v-for="(item, index) in parentSubmissions" :key="item.submissionId">
                    <CTableDataCell class="text-center">{{ index + 1 }}</CTableDataCell>
                    <CTableDataCell>
                      <div>{{ item.outletName }}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{{ item.areaName }}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      {{ new Date(item.createdAt).toLocaleDateString('id-ID') }}
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script setup>
import MainChart from './MainChart.vue'
import WidgetsStatsA from './../widgets/WidgetsStatsTypeA.vue'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CSpinner } from '@coreui/vue'

const submissions = ref([])
const parentSubmissions = ref([])
const loading = ref(true)
const loadingParent = ref(true)
const apiUrl = import.meta.env.VITE_API_URL

const fetchSubmissions = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Token not found')

    const response = await axios.get(`${apiUrl}/api/submissions?page_number=1&page_size=5&q=&parent_id=false`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.status === 200) {
      submissions.value = response.data.data || []
    }
  } catch (error) {
    console.error('Failed to fetch submissions:', error)
    submissions.value = []
  } finally {
    loading.value = false
  }
}

const fetchParentSubmissions = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Token not found')

    const response = await axios.get(`${apiUrl}/api/parents?page_size=10&page_number=1`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.status === 200) {
      parentSubmissions.value = response.data.data || []
    }
  } catch (error) {
    console.error('Failed to fetch parent submissions:', error)
    parentSubmissions.value = []
  } finally {
    loadingParent.value = false
  }
}

onMounted(() => {
  fetchSubmissions()
  fetchParentSubmissions()
})

const data = {
  labels: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  datasets: [
    {
      label: 'Pengajuan Service/Ganti',
      backgroundColor: '#f87979',
      data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 12],
    },
  ],
}

</script>