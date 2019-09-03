export const lessonTab = [
    { title: '基本信息' },
    { title: '课堂记录'},
    { title: '评语' },
    { title: '汇总评价' },
];
export  const baseItems = [
    {
        name:'subjectName',
        title:'课题',
        placeholder:'请输入课题',
        required:true,
        length:30
    },
    {
        name:'schoolName',
        title:'学校',
        placeholder:'请输入学校',
        // itemType:'select',
        required:false,
        length:30
    },
    {
        name:'teacheName',
        title:'讲课人',
        placeholder:'请输入讲课人',
        required:true,
        length:30
    },
    {
        name:'stratTime',
        title:'时间',
        placeholder:'请输入课堂时间',
        itemType:'date',
        required:false
    },
    {
        name:'address',
        title:'地址',
        placeholder:'请输入课堂地址',
        required:false,
        length:40
    },
    {
        name:'greadeName',
        title:'年级',
        placeholder:'请输入年级',
        // itemType:'select',
        required:false,
        length:10
    },
    {
        name:'className',
        title:'班级',
        placeholder:'请输入班级',
        // itemType:'select',
        required:false,
        length:10,
    },
    {
        name:'courseName',
        title:'科目',
        placeholder:'请输入科目',
        // itemType:'select',
        required:false,
        length:16
    },
    {
        name:'courseType',
        title:'课型',
        placeholder:'请输入课型',
        required:false,
        length:30
    },
    {
        name:'courseClassify',
        title:'类别',
        placeholder:'请输入类别',
        itemType:'select',
        required:true
    },

];
export const textItems = {
    contentInput:{
        title:'课堂实录',
        name:'contentInput',
        placeholder:"请填写课堂实录",
        count:999,
        row:20,
    },
    opinionInput:{
        title:'意见/反思',
        name:'opinionInput',
        placeholder:"请填写意见",
        count:500,
        row:5
    },
    pingyuVo:{
        title:'',
        name:'contentInput',
        placeholder:"请填写评语",
        count:999,
        row:5
    },
    huizongPingjiaVo:{
        title:'',
        name:'contentInput',
        placeholder:"请填写汇总评价",
        count:999,
        row:5,
    }
};

export const greadeNameData = [
    { label: '一年级',value: '1'},
    { label: '二年级',value: '2'},
    { label: '三年级',value: '3'},
    { label: '四年级',value: '4'},
    { label: '五年级',value: '5'},
    { label: '六年级',value: '6'},
    { label: '初一',value: '7'},
    { label: '初二',value: '8'},
    { label: '初三',value: '9'},
    { label: '高一',value: '10'},
    { label: '高二',value: '11'},
    { label: '高三',value: '12'},
];
export const courseTypeData = [
    { label: '普通课',value: '1'},
    { label: '教研课',value: '2'},
    { label: '区级班主任工作室',value: '3'},
    { label: '校级班主任工作室',value: '4'},
];

