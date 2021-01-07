<template>
  <v-container>
    <v-row class="fill-height" no-gutters>
      <v-col>
        <v-sheet height="64">
          <v-toolbar flat>
            <v-toolbar-title v-if="$refs.calendar">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
          </v-toolbar>
        </v-sheet>
        <v-sheet height="600">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :type="type"
          ></v-calendar>
        </v-sheet>
      </v-col>
      <v-col cols="12" sm="3" align="right">
        <v-sheet height="64"></v-sheet>
        <v-card class="pa-2" outlined tile>
          <v-sheet height="600">
            <v-list nav dense>
              <v-header class="text-h5 font-weight-bold text-decoration-underline">:קניות</v-header>
              <v-list-item-group color="primary">
                <v-list-item v-for="(item, i) in items" :key="i">
                  <v-list-item-content>
                    <v-list-item-title v-text="item.text" class="text-h6"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-sheet>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import EventService from '@/services/EventService.js';
export default {
  data: () => ({
    items: [
      { text: "חלב" }
        // TODO: fill this from backend (grocery list)
        // { text: 'My Files'},
        // { text: 'Shared with me'},
        // { text: 'Starred'},
        // { text: 'Recent'},
        // { text: 'Offline'},
        // { text: 'Uploads'},
        // { text: 'Backups'}
    ],
    polling: null,
    focus: '',
    type: 'month',
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: []
  }),
  mounted(){
    this.$refs.calendar.checkChange()
  },
  methods:{
    mapColor(status){
      if(status === 'confirmed'){
        return 'blue'
      }else if(status === 'tentative'){
        return 'gray'
      }else{
        return 'red'
      }
    },  
    async pollData () {
      this.polling = setInterval(async () => {
        let recived = await EventService.getEvents()
        let transformed = recived.map(event => {
          let start_iso = event.start.dateTime || "0001-01-01T00:00:00+01:00"
          let start_dt = `${start_iso.split('T')[0]} ${start_iso.split('T')[1].slice(0,5)}`
          let end_iso = event.end.dateTime || "0001-01-01T00:00:00+01:00"
          let end_dt = `${end_iso.split('T')[0]} ${end_iso.split('T')[1].slice(0,5)}`
            return {
              name: event.summary,
              start: start_dt,
              end: end_dt,
              color: this.mapColor(event.status),
              timed: false
            }
        });
        // console.log(transformed)
        this.events = transformed
        }, 5000)
    }
  },
  beforeDestroy(){
    clearInterval(this.polling)
    },
  created(){
    this.pollData()
  }
}
</script>

<style scoped>
</style>