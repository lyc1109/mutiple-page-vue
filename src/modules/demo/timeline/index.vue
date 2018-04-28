<template>
  <v-app>
    <div slot="header-title">时间轴(v-timeline)</div>
    <div slot="header-actions">
      <!--<router-link to="/bulletin/create">
        <el-button size="medium" type="primary">发布公告</el-button>
      </router-link>-->
    </div>

    <div class="padding-m">
      <h3 class="margin-bottom-m">时间轴一</h3>
      <v-timeline :data="timelineData1"></v-timeline>
    </div>
    <div class="padding-m">
      <h3 class="margin-bottom-m">时间轴二</h3>
      <v-timeline :data="timelineData2"></v-timeline>
    </div>
  </v-app>
</template>

<script>
  import VTimeline from "@/components/v-timeline";

  export default {
    name: "demo-timeline",
    desc: "时间轴例子",
    components: {VTimeline},
    data: function () {
      return {
        timelineData1: [
          "2018-04-20 14:00 时间轴日志6",
          "2018-04-20 13:00 时间轴日志5",
          "2018-04-20 12:00 时间轴日志4",
          "2018-04-20 11:00 时间轴日志3",
          "2018-04-20 10:00 时间轴日志2",
          "2018-04-20 09:00 时间轴日志1"
        ],
        timelineData2: [
          "净水记录3.5升 <div class='font-lighter font-s margin-top-s'>2018-04-20 14:00</div>",
          "净水记录3升 <div class='font-lighter font-s margin-top-s'>2018-04-20 13:00</div>",
          "净水记录250毫升 <div class='font-lighter font-s margin-top-s'>2018-04-20 12:00</div>",
          "净水记录200毫升 <div class='font-lighter font-s margin-top-s'>2018-04-20 11:00</div>",
          "净水记录1升 <div class='font-lighter font-s margin-top-s'>2018-04-20 10:00</div>",
          "净水记录300毫升 <div class='font-lighter font-s margin-top-s'>2018-04-20 09:00</div>",
        ]
      }
    }
  }
</script>

