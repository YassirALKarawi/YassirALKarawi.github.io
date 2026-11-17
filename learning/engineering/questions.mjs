import {makeCase} from './assessment.mjs';
const checks={
 pcm:'ماذا يحدث لمعدل البت إذا ضاعفت معدل العينات وطول الكلمة معاً؟|If sample rate and word length both double, what happens to bit rate?~يصبح أربعة أمثال الأصل.|It quadruples.~يتضاعف فقط.|It only doubles.~يبقى ثابتاً.|It stays constant.',
 shannon:'قبل استعمال نسبة SNR بالديسيبل داخل اللوغاريتم، ماذا تفعل؟|What must you do with SNR in dB before using it inside the logarithm?~أحوّلها إلى نسبة قدرة خطية.|Convert it to a linear power ratio.~أقسمها على عرض النطاق.|Divide it by bandwidth.~أستعمل رقم الديسيبل مباشرة.|Use the dB value directly.',
 ohm:'كيف تقيس تيار المقاومة؟|How should you measure resistor current?~أدخل الأميتر على التوالي معها.|Insert the ammeter in series.~أوصل الأميتر على التوازي معها.|Place the ammeter across the resistor.~أقيس الجهد بالأميتر.|Measure voltage with the ammeter.',
 copper:'عند مضاعفة التيار وثبات المقاومة، ما تغير الفقد؟|With twice the current and fixed resistance, what happens to loss?~يصبح أربعة أمثال قيمته.|It quadruples.~ينخفض إلى النصف.|It halves.~يتضاعف فقط.|It only doubles.',
 rc:'ما سعة الخرج عند تردد القطع لدخل سعته 1 V قمة؟|For a 1 V peak input, what is the output amplitude at cutoff?~نحو 0.707 V قمة.|About 0.707 V peak.~0.5 V قمة بالضبط.|Exactly 0.5 V peak.~1.414 V قمة.|1.414 V peak.',
 gain:'ما الذي ينهي صلاحية نموذج الكسب الخطي؟|Which condition invalidates the linear amplifier gain?~تشبّع جهد الخرج.|Output clipping.~زيادة ممانعة أداة القياس.|Increasing instrument input impedance.~اختيار إشارة دخل أصغر.|Using a smaller input signal.',
 transfer:'أي زوج وحدات يستدعي معامل ثمانية؟|Which unit pair needs a factor of eight?~MB وMbit.|MB and Mbit.~ms وs.|ms and s.~MHz وHz.|MHz and Hz.',
 cache:'متى تُضاف عقوبة الإخفاق الإضافية؟|When is the additional cache miss penalty incurred?~عند إخفاق الذاكرة المخبئية.|On a cache miss.~مرة ثابتة لكل برنامج.|Once per program.~عند كل إصابة فقط.|Only on a hit.',
 beam:'أين تقيس أقصى هبوط لهذه العارضة؟|Where is maximum deflection for this beam?~في منتصف البحر تحت الحمل.|At midspan beneath the point load.~عند المسند الأيسر.|At the left support.~عند المسند الأيمن.|At the right support.',
 slab:'ما المساحة المناسبة لحساب الحجم الصافي؟|Which area gives net slab volume?~المساحة بعد خصم الفتحات.|Area after openings are subtracted.~مساحة الموقع كله.|Entire site area.~محيط البلاطة مضروباً بالسماكة.|Perimeter times thickness.',
 shaft:'أي كمية تقترن بالعزم لتعطي القدرة؟|Which quantity multiplied by torque gives power?~السرعة الزاوية بالراديان في الثانية.|Angular speed in radians per second.~الزاوية المقطوعة فقط.|Angular displacement alone.~كتلة المحرك.|Motor mass.',
 spring:'ما تفسير المساحة تحت منحنى القوة والإزاحة؟|What is the area beneath force versus extension?~الشغل المخزّن في النابض المرن.|Work stored in the elastic spring.~التردد الطبيعي.|Natural frequency.~معدل فقد الحرارة.|Heat loss rate.',
 encoder:'ما أثر العد التربيعي ×4؟|What does ×4 quadrature decoding do?~يعطي أربع عدّات لكل دورة إشارة واحدة.|It gives four counts per signal cycle.~يزيد السرعة الميكانيكية أربع مرات.|It quadruples shaft speed.~يلغي الخلوص الميكانيكي.|It removes mechanical backlash.',
 step:'ما نسبة الاستجابة عند t = τ؟|What fraction of final response is reached at t = τ?~نحو 63.2%.|About 63.2%.~نحو 36.8%.|About 36.8%.~100%.|100%.',
 flow:'ما شرط استعمال قانون ليتل بهذه الصورة؟|What does this use of Little’s law require?~متوسطات مستقرة لنفس حدود النظام.|Stable averages over the same system boundary.~أن تكون كل أزمنة الخدمة متساوية.|All service times must be identical.~خلو الخط من أي انتظار.|There must be no waiting.',
 yield:'إلى ماذا ينسب مردود المرحلة الثانية؟|What is the denominator for second-stage yield?~إلى الوحدات الداخلة إلى المرحلة الثانية.|Units entering stage two.~إلى جميع المرفوضات.|All rejected units.~إلى زمن المرحلة الأولى.|First-stage duration.',
 mix:'ماذا يُحفظ عند خلط تيارين دون تفاعل؟|What is conserved in nonreacting mixing?~معدل تدفق كتلة المذاب في الميزان المستقر.|Solute mass flow in the steady balance.~المتوسط الحسابي للتركيزين دائماً.|The unweighted mean concentration in every case.~تركيز كل تيار منفرداً.|Each stream concentration individually.',
 heat:'أي تغير يتطلب تعديل نموذج التسخين المحسوس؟|Which change requires revising the sensible-heating model?~حدوث تبخر.|Vaporization.~زيادة التدفق ضمن طور سائل واحد.|Higher flow in the same liquid phase.~قياس فرق الحرارة بالكلفن.|Measuring temperature difference in kelvin.',
 light:'أي تدفق يدخل في حساب الاستضاءة المعروض؟|Which flux belongs in this illuminance calculation?~التدفق الواصل إلى مستوى العمل.|Flux reaching the work plane.~القدرة الكهربائية للمصباح.|Electrical input wattage.~تدفق الضوء الهارب خارج القاعة.|Light escaping from the room.',
 wall:'ماذا تصف قيمة U؟|What does U describe?~معامل انتقال الحرارة الكلي للجدار.|Overall wall heat-transfer coefficient.~كتلة الجدار.|Wall mass.~طاقة تراكمت خلال يوم.|Energy accumulated in a day.',
 pv:'أين يقاس الإشعاع المستعمل لتقدير خرج اللوح؟|Where is the irradiance used for panel output measured?~في مستوى اللوح نفسه.|In the panel plane.~عند خرج العاكس.|At the inverter output.~داخل البطارية.|Inside the battery.',
 battery:'عند ثبات طاقة البطارية، ما أثر مضاعفة الحمل؟|At fixed usable energy, what is the effect of doubling load?~ينخفض زمن التغذية للنصف.|Run time halves.~يتضاعف زمن التغذية.|Run time doubles.~تبقى مدة التغذية ثابتة.|Run time is unchanged.',
 basin:'هل V/Q زمن مرور كل جسيم منفرد؟|Does V/Q equal the time taken by every particle?~يمثل زمناً اسمياً وتختلف الأزمنة الفعلية.|It is nominal and individual times vary.~نعم، مهما كان نمط الجريان.|Yes, under every flow pattern.~إنه سرعة الماء الموضعية.|It is the local flow speed.',
 removal:'ماذا يساوي 1 mg/L بوحدات أخرى؟|Which unit conversion is correct?~1 g/m³.|1 g/m³.~1 kg/m³.|1 kg/m³.~1 mg/m³.|1 mg/m³.',
 stress:'أي مساحة تدخل في الإجهاد الهندسي؟|Which area is used for engineering stress?~مساحة المقطع الأولية.|Initial cross-sectional area.~المساحة الجانبية.|Lateral area.~مساحة المقطع عند الكسر دائماً.|Always the fracture area.',
 strain:'لماذا نقسم الاستطالة على طول القياس الأولي؟|Why divide elongation by initial gauge length?~لمقارنة التشوه النسبي لعينات مختلفة الطول.|To compare relative deformation across specimen lengths.~لتحويل القوة إلى ضغط.|To convert force into pressure.~لاستخراج معامل الاحتكاك.|To obtain friction coefficient.',
 adc:'عند زيادة عمق المحول بتاً واحداً، ماذا يحدث لخطوة التكميم؟|What happens to bin width after adding one ADC bit at fixed span?~تنخفض إلى النصف.|It halves.~تتضاعف.|It doubles.~تنخفض إلى الربع.|It becomes one quarter.',
 sensor:'ما الخطأ عند ضرب دخل بالميليفولت في الكسب وتسميته فولت؟|What error results from labeling millivolts times gain as volts?~مبالغة بمقدار ألف مرة.|A thousandfold overestimate.~تقليل النتيجة إلى النصف.|A twofold underestimate.~إلغاء الكسب تلقائياً.|Gain cancels automatically.',
 pore:'هل المسامية العالية تثبت نفاذية عالية؟|Does high porosity establish high permeability?~الاتصال بين المسام مؤثر أيضاً.|Connectivity also matters.~نعم لأن الكميتين مترادفتان.|Yes, the quantities are identical.~نعم لأنهما بوحدة الضغط.|Yes, both use pressure units.',
 saturation:'ما الحجم المرجعي للتشبّع المائي؟|What is the reference volume for water saturation?~حجم المسام.|Pore volume.~الحجم الكلي للصخر.|Bulk rock volume.~حجم الحبيبات الصلبة.|Solid grain volume.',
 symbol:'أي تغيير يخفّض معدل الرموز عند ثبات معدل البت؟|What lowers symbol rate at fixed bit rate?~زيادة البتات في الرمز.|Increasing bits per symbol.~زيادة معدل البت.|Increasing bit rate.~تقليل زمن البت عند ثبات الأبجدية.|Reducing bit duration at fixed alphabet.',
 waveguide:'كيف يقاس طول الموجة مكانياً؟|How do you measure wavelength in space?~بين قمتين متتاليتين عند اللحظة نفسها.|Between adjacent peaks at the same instant.~بين قمة وقاع مجاور.|Between an adjacent peak and trough.~من عدد البتات في كلمة.|From bit count in a word.',
 divider:'ما أثر تحميل الخرج بمقاومة صغيرة؟|What happens if a low resistance loads the divider output?~يتغير جهد الخرج عن قيمة اللا حمل.|Output departs from its no-load value.~يبقى الجهد ثابتاً في كل الأحوال.|Output always stays fixed.~ينقطع مسار الدخل تماماً.|The input path becomes open.',
 charging:'لماذا يتناقص تيار الشحن بمرور الوقت؟|Why does charging current fall over time?~يقل فرق الجهد على المقاومة.|The resistor voltage drop falls.~تتناقص قيمة المقاومة إلى الصفر.|Resistance drops to zero.~تنعكس قطبية المصدر دورياً.|Source polarity alternates.',
 propagation:'أي تأخير لا يتغير عند مضاعفة معدل إرسال البتات لنفس الليف؟|Which delay is unchanged by doubling bit rate on the same fiber?~تأخير الانتشار.|Propagation delay.~زمن تسلسل ملف ثابت.|Serialization time for a fixed file.~زمن إرسال البت الواحد.|Time to transmit a bit.',
 amdahl:'لماذا لا يزداد التسريع خطياً مع عدد الأنوية؟|Why does speedup stop scaling linearly?~الجزء التسلسلي يبقى قائماً.|The serial portion remains.~عدد الأنوية لا يدخل في النموذج.|Core count is absent from the model.~كل برنامج متوازٍ بالكامل.|Every program is fully parallel.',
 vibration:'ما أثر زيادة الكتلة أربع مرات عند ثبات الصلابة؟|What happens if mass quadruples at fixed stiffness?~ينخفض التردد الطبيعي إلى النصف.|Natural frequency halves.~يتضاعف التردد.|Frequency doubles.~ينخفض إلى الربع.|It becomes one quarter.',
 pump:'كيف تستنتج قدرة العمود عند معرفة كفاءة المضخة؟|How do you infer shaft input from pump efficiency?~أقسم القدرة الهيدروليكية على الكفاءة.|Divide hydraulic power by efficiency.~أضرب الارتفاع بالكفاءة فقط.|Multiply only head by efficiency.~أساوي دائماً بين قدرة العمود وقدرة السائل.|Always equate shaft and fluid power.',
 hydro:'لماذا تقع محصلة الضغط أسفل مركز سطح البوابة؟|Why is the force resultant below the gate-area centroid?~لأن الضغط يزداد مع العمق.|Pressure increases with depth.~لأن الضغط ثابت على كامل السطح.|Pressure is uniform over the face.~لأن الجاذبية تتغير عبر البوابة.|Gravity varies across the gate.',
 expansion:'ما أثر منع حركة طرفي القضيب؟|What changes if both ends are restrained?~قد ينشأ إجهاد حراري.|Thermal stress can develop.~يبقى التمدد حراً.|Expansion stays unrestricted.~يصبح معامل التمدد صفراً.|Expansion coefficient becomes zero.',
 gear:'ما اتجاه دوران ترسين خارجيين متعاشقين؟|How do two meshing external gears rotate?~باتجاهين متعاكسين.|In opposite directions.~بالاتجاه نفسه دائماً.|Always in the same direction.~يتوقف الترس الأكبر.|The larger gear stops.',
 util:'إذا علمت الاستفادة وحدها، هل تعرف زمن الانتظار الدقيق؟|Does utilization alone determine exact wait time?~أحتاج خصائص الوصول والخدمة أيضاً.|Arrival and service behavior are also needed.~نعم، الاستفادة تساوي الدقائق.|Yes, utilization equals minutes.~الانتظار يساوي صفراً دائماً.|Waiting is always zero.',
 washout:'أي إشارة تدل على مزج تام أثناء الغسل؟|Which observation fits ideal washout?~انخفاض أسي للتركيز مع الزمن.|Exponential concentration decay.~انخفاض خطي حتى الصفر تماماً بعد V/Q.|Linear decrease to zero exactly at V/Q.~تركيز ثابت في جميع الأزمنة.|Constant concentration forever.',
 acoustics:'ما أثر زيادة الامتصاص المكافئ عند ثبات حجم القاعة؟|At fixed volume, what happens when absorption increases?~يقصر زمن الارتداد.|Reverberation time decreases.~يطول زمن الارتداد.|Reverberation time increases.~تتضاعف سرعة الصوت.|Sound speed doubles.',
 inverter:'كيف تجري مقارنة كفاءة صحيحة؟|How should conversion efficiency be assessed?~أقارن متوسطَي قدرة لنفس الفترة.|Compare mean powers over the same interval.~أقارن جهد الدخل بتيار الخرج.|Compare input voltage with output current.~أستعمل دائماً قيمة الذروة للدخل وحدها.|Use only peak input power.',
 runoff:'أي زمن مطر تفترضه الطريقة هنا؟|Which storm duration does this application assume?~لا يقل عن زمن التركيز.|At least the time of concentration.~صفراً مهما كانت مساحة الحوض.|Zero regardless of catchment size.~فترة أخذ عينة الماء فقط.|Only the water sampling interval.',
 darcy:'أي تغيير يخالف فرضية اختبار دارسي المعروضة؟|Which change violates this core test assumption?~جريان طورين معاً.|Two-phase flow.~تثبيت اللزوجة.|Holding viscosity fixed.~استعمال تصريف مستقر.|Using steady discharge.',
 bridge:'أي قياس يعبّر عن عدم اتزان الجسر؟|Which measurement represents bridge imbalance?~فرق الجهد بين منتصفَي الذراعين.|Voltage difference between the two midpoints.~جهد المصدر وحده.|Supply voltage alone.~مجموع قيم المقاومات بالأوم.|Sum of all resistances in ohms.'
};
export const formats=['direct','reverse','delta','percent','ratio','diagnosis'];
export const examForms={quick:[6,10],midterm:[12,24],final:[20,40],diagnostic:[8,14]};
export function exercise(l,kind,random=Math.random){
 const v=makeCase(l,random);
 // The lower half of the input range avoids indistinguishable readings in
 // asymptotic step responses when asking learners to infer an input.
 if(kind==='reverse'&&['step','charging','washout'].includes(l.id)){v.x=l.x.min;v.y=l.y.initial}
 const ticks=Math.round((l.x.max-l.x.min)/l.x.step),index=Math.round((v.x-l.x.min)/l.x.step);
 const shift=Math.max(1,Math.floor(ticks/4));
 let x2=Number((l.x.min+((index+shift)%(ticks+1))*l.x.step).toFixed(6));
 if(Math.abs(l.calc(v.x,v.y)-l.calc(x2,v.y))<Math.abs(l.calc(v.x,v.y))*1e-5)x2=v.x===l.x.min?l.x.max:l.x.min;
 const order=[0,1,2];for(let i=2;i>0;i--){const j=Math.floor(random()*(i+1));[order[i],order[j]]=[order[j],order[i]]}
 return {...v,kind,x2,order};
}
export function theory(id){const [prompt,...options]=checks[id].split('~');return {prompt,options}}
export function answerFor(l,v){const first=l.calc(v.x,v.y),second=l.calc(v.x2??v.x,v.y);switch(v.kind){
 case 'reverse':return v.x;case 'delta':return second-first;case 'percent':return 100*(second-first)/first;case 'ratio':return second/first;case 'diagnosis':return v.order.indexOf(0);default:return first}}
export function unitFor(l,v){return ({reverse:l.x.unit,percent:'%',ratio:'×',diagnosis:''})[v.kind]??l.unit}
export function testDeck(pool,form,random=Math.random){
 const [count]=examForms[form];const allowed=form==='diagnostic'?['diagnosis','reverse','percent']:formats;
 const shuffle=values=>{const a=[...values];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
 const seq=shuffle(pool), kinds=shuffle(allowed), deck=[];
 for(let round=0;deck.length<count;round++){for(let j=0;j<seq.length&&deck.length<count;j++){const l=seq[j];let kind=kinds[(round+j)%kinds.length];if(kind==='diagnosis'&&deck.some(q=>q.id===l.id&&q.kind==='diagnosis'))kind='direct';deck.push(exercise(l,kind,random))}}
 return deck;
}
