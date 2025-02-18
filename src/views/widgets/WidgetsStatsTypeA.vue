<script setup>
import { onMounted, ref } from 'vue'
import { getStyle } from '@coreui/utils'
import jwt_decode from 'jwt-decode'
import axios from 'axios'

// Refs
const widgetChartRef1 = ref()
const widgetChartRef2 = ref()
const totalCount = ref(0)
const totalPengajuanService = ref(0)
const totalPengajuanGanti = ref(0)
const totalLaporanBarangHilang = ref(0)
const submissionLabels = ref([])
const submissionData = ref([]) 
const loading = ref(true)
const apiUrl = import.meta.env.VITE_API_URL

// Variables for user information
const user_role_id = ref(null)
const user_outlet_id = ref(null)
const user_area_id = ref(null)

// Parse token and set user information
const parseToken = () => {
  const token = localStorage.getItem('token')
  if (token) {
    const decoded = jwt_decode(token)
    user_role_id.value = decoded.role_id
    user_outlet_id.value = decoded.outlet_id
    user_area_id.value = decoded.area_id
    console.log('Role ID:', user_role_id.value)
    console.log('Outlet ID:', user_outlet_id.value)
    console.log('Area ID:', user_area_id.value)
  } else {
    console.error('Token not found in local storage')
  }
}

// Fetch total assets count
const fetchTotalAssets = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Token not found')

    const response = await axios.get(`${apiUrl}/api/assets`, {
      params: {
        user_role_id: user_role_id.value,
        user_area_id: user_area_id.value,
        user_outlet_id: user_outlet_id.value,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    totalCount.value = response.data.totalCount || 0
  } catch (error) {
    console.error('Failed to fetch total assets:', error)
    totalCount.value = 0
  } finally {
    loading.value = false
  }
}

// Fetch submission data
const fetchSubmissionData = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Token not found')

    const response = await axios.get(`${apiUrl}/api/submissions?page_number=1&page_size=10&q=`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    totalPengajuanService.value = response.data.totalPengajuanService || 0
    totalPengajuanGanti.value = response.data.totalPengajuanGanti || 0
    totalLaporanBarangHilang.value = response.data.totalLaporanBarangHilang || 0

    const submissions = response.data.data || []
    const monthlyCounts = {}

    submissions.forEach(submission => {
      const date = new Date(submission.submissionDate)
      const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' })
      monthlyCounts[monthYear] = (monthlyCounts[monthYear] || 0) + 1
    })

    submissionLabels.value = Object.keys(monthlyCounts)
    submissionData.value = Object.values(monthlyCounts)
  } catch (error) {
    console.error('Failed to fetch submission data:', error)
    totalPengajuanService.value = 0
    submissionLabels.value = []
    submissionData.value = []
  } finally {
    loading.value = false
  }
}

// onMounted lifecycle hook
onMounted(async () => {
  parseToken()
  await fetchTotalAssets()
  await fetchSubmissionData()

  document.documentElement.addEventListener('ColorSchemeChange', () => {
    if (widgetChartRef1.value) {
      widgetChartRef1.value.chart.data.datasets[0].pointBackgroundColor = getStyle('--cui-primary')
      widgetChartRef1.value.chart.update()
    }

    if (widgetChartRef2.value) {
      widgetChartRef2.value.chart.data.datasets[0].pointBackgroundColor = getStyle('--cui-info')
      widgetChartRef2.value.chart.update()
    }
  })
})
</script>

<!-- card total aset -->
<template>
  <CRow :xs="{ gutter: 4 }">
    <CCol :sm="6" :xl="4" :xxl="3">
      <CWidgetStatsA color="primary">
        <template #value>
          <div v-if="loading">
            <CSpinner color="primary" />
          </div>
          <div v-else>
            {{ totalCount }}
            <span class="fs-6 fw-normal"> </span>
          </div>
        </template>
        <template #title>Total Aset</template>
        <template #action>
          <CDropdown placement="bottom-end">
            <CDropdownToggle color="transparent" class="p-0 text-white" :caret="false">
              <CIcon icon="cil-options" class="text-white" />
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem href="#">View</CDropdownItem>
              <!-- <CDropdownItem href="#">Another action</CDropdownItem>
              <CDropdownItem href="#">Something else here</CDropdownItem> -->
            </CDropdownMenu>
          </CDropdown>
        </template>

<!-- diagram garis pengajuan aset berdasarkan waktu -->
        <template #chart>
          <CChart
            type="line"
            class="mt-3 mx-3"
            style="height: 70px"
            ref="widgetChartRef1"
            :data="{
              labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
              datasets: [
                {
                  label: 'My First dataset',
                  backgroundColor: 'transparent',
                  borderColor: 'rgba(255,255,255,.55)',
                  pointBackgroundColor: getStyle('--cui-primary'),
                  // data: [68, 59, 84, 84, 51, 55, 40],
                },
              ],
            }"
            :options="{
              plugins: {
                legend: {
                  display: false,
                },
              },
              maintainAspectRatio: false,
              scales: {
                x: {
                  border: {
                    display: false,
                  },
                  grid: {
                    display: false,
                  },
                  ticks: {
                    display: false,
                  },
                },
                y: {
                  min: 30,
                  max: 89,
                  display: false,
                  grid: {
                    display: false,
                  },
                  ticks: {
                    display: false,
                  },
                },
              },
              elements: {
                line: {
                  borderWidth: 1,
                  tension: 0.4,
                },
                point: {
                  radius: 4,
                  hitRadius: 10,
                  hoverRadius: 4,
                },
              },
            }"
          />
        </template>
      </CWidgetStatsA>
    </CCol>

    <!-- Card pengajuan service -->
    <CCol :sm="6" :xl="4" :xxl="3">
      <CWidgetStatsA color="info">
        <template #value>
      <div v-if="loading">
        <CSpinner color="primary" />
      </div>
      <div v-else>
        {{ totalPengajuanService }}
        <span class="fs-6 fw-normal"> </span>
      </div>
    </template>
        <template #title>Pengajuan Service</template>
        <template #action>
          <CDropdown placement="bottom-end">
            <CDropdownToggle color="transparent" class="p-0 text-white" :caret="false">
              <CIcon icon="cil-options" class="text-white" />
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem href="#">Detail</CDropdownItem>
              <!-- <CDropdownItem href="#">Another action</CDropdownItem>
              <CDropdownItem href="#">Something else here</CDropdownItem> -->
            </CDropdownMenu>
          </CDropdown>
        </template>
        <template #chart>
          <CChart
            type="line"
            class="mt-3 mx-3"
            style="height: 70px"
            ref="widgetChartRef2"
            :data="{
              labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
              datasets: [
                {
                  label: 'My First dataset',
                  backgroundColor: 'transparent',
                  borderColor: 'rgba(255,255,255,.55)',
                  pointBackgroundColor: getStyle('--cui-info'),
                  // data: [1, 18, 9, 17, 34, 22, 11],
                },
              ],
            }"
            :options="{
              plugins: {
                legend: {
                  display: false,
                },
              },
              maintainAspectRatio: false,
              scales: {
                x: {
                  border: {
                    display: false,
                  },
                  grid: {
                    display: false,
                  },
                  ticks: {
                    display: false,
                  },
                },
                y: {
                  min: -9,
                  max: 39,
                  display: false,
                  grid: {
                    display: false,
                  },
                  ticks: {
                    display: false,
                  },
                },
              },
              elements: {
                line: {
                  borderWidth: 1,
                },
                point: {
                  radius: 4,
                  hitRadius: 10,
                  hoverRadius: 4,
                },
              },
            }"
          />
        </template>
      </CWidgetStatsA>
    </CCol>
    <CCol :sm="6" :xl="4" :xxl="3">
      <CWidgetStatsA color="warning">
        <template #value>
      <div v-if="loading">
        <CSpinner color="primary" />
      </div>
      <div v-else>
        {{ totalPengajuanGanti }}
        <span class="fs-6 fw-normal"> </span>
      </div>
    </template>
        <template #title>Pengajuan Ganti Aset</template>
        <template #action>
          <CDropdown placement="bottom-end">
            <CDropdownToggle color="transparent" class="p-0 text-white" :caret="false">
              <CIcon icon="cil-options" class="text-white" />
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem href="#">Action</CDropdownItem>
              <CDropdownItem href="#">Another action</CDropdownItem>
              <CDropdownItem href="#">Something else here</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </template>
        <template #chart>
          <CChart
            type="line"
            class="mt-3"
            style="height: 70px"
            :data="{
              labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
              datasets: [
                {
                  label: 'My First dataset',
                  backgroundColor: 'rgba(255,255,255,.2)',
                  borderColor: 'rgba(255,255,255,.55)',
                  data: [78, 81, 80, 45, 34, 12, 40],
                  fill: true,
                },
              ],
            }"
            :options="{
              plugins: {
                legend: {
                  display: false,
                },
              },
              maintainAspectRatio: false,
              scales: {
                x: {
                  border: {
                    display: false,
                  },
                  display: false,
                },
                y: {
                  display: false,
                },
              },
              elements: {
                line: {
                  borderWidth: 2,
                  tension: 0.4,
                },
                point: {
                  radius: 0,
                  hitRadius: 10,
                  hoverRadius: 4,
                },
              },
            }"
          />
        </template>
      </CWidgetStatsA>
    </CCol>
    <CCol :sm="6" :xl="4" :xxl="3">
      <CWidgetStatsA color="danger">
        <template #value>
      <div v-if="loading">
        <CSpinner color="primary" />
      </div>
      <div v-else>
        {{ totalLaporanBarangHilang }}
        <span class="fs-6 fw-normal"> </span>
      </div>
    </template>
        <template #title>Laporan Aset Hilang</template>
        <template #action>
          <CDropdown placement="bottom-end">
            <CDropdownToggle color="transparent" class="p-0 text-white" :caret="false">
              <CIcon icon="cil-options" class="text-white" />
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem href="#">Action</CDropdownItem>
              <CDropdownItem href="#">Another action</CDropdownItem>
              <CDropdownItem href="#">Something else here</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </template>
        <template #chart>
          <CChart
            type="bar"
            class="mt-3 mx-3"
            style="height: 70px"
            :data="{
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
                'January',
                'February',
                'March',
                'April',
              ],
              datasets: [
                {
                  label: 'My First dataset',
                  backgroundColor: 'rgba(255,255,255,.2)',
                  borderColor: 'rgba(255,255,255,.55)',
                  data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
                  barPercentage: 0.6,
                },
              ],
            }"
            :options="{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  grid: {
                    display: false,
                    drawTicks: false,
                  },
                  ticks: {
                    display: false,
                  },
                },
                y: {
                  border: {
                    display: false,
                  },
                  grid: {
                    display: false,
                    drawTicks: false,
                  },
                  ticks: {
                    display: false,
                  },
                },
              },
            }"
          />
        </template>
      </CWidgetStatsA>
    </CCol>
  </CRow>
</template>
