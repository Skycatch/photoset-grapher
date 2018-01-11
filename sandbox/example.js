'use strict';
const d3Target = '#system';

/*******************************************************************/
/* This is the entry point for the implentation if your library    */
/* I bound it to window because it would be otherwise unaccessable */
/* with the way webpack serves the sandbox files                   */
/*******************************************************************/

const PhotosetGrapher = window['@skycatch/photoset-grapher'];

const internals = {};
//const sample = [[0,0,0], [0, 0, 3], [0, 5, 0], [10, 0, 0]];
const sample = [[142.08271,42.60278027777778,54.35],[142.0831225,42.60281944444444,54.89],[142.0831538888889,42.602782222222224,54.19],[142.08318416666665,42.602743333333336,53.96],[142.08262027777778,42.602895000000004,57.24],[142.08309194444445,42.60286444444444,54.31],[142.0838752777778,42.60304722222222,55.24],[142.08383972222222,42.60303861111111,55.65],[142.08262249999999,42.602891944444444,53.98],[142.0840088888889,42.60310138888889,55.26],[142.08276083333334,42.60297555555556,55.21],[142.08332166666665,42.60279277777778,55.47],[142.08294944444444,42.60275416666667,52.3],[142.08306,42.602898611111115,53.3],[142.08279916666666,42.60266138888889,55.09],[142.0836661111111,42.60297666666667,51.76],[142.08301805555556,42.60294805555556,53.4],[142.08321555555554,42.602987222222225,54.07],[142.08293083333334,42.603054444444446,53.62],[142.08324555555555,42.6029525,53.95],[142.0827647222222,42.60270527777778,55.59],[142.08310583333332,42.60313,55.2],[142.08347055555558,42.60321611111111,54.25],[142.0827936111111,42.602944722222226,54.15],[142.08379083333335,42.60310611111111,52.57],[142.08353805555558,42.6031375,54.2],[142.08359305555555,42.60306777777778,52.96],[142.08356361111112,42.60310305555556,52.63],[142.08378583333334,42.60339666666667,51.23],[142.08384777777778,42.60331333333333,52.07],[142.08273666666668,42.60274305555556,55.3],[142.08381472222223,42.60335527777778,51.36],[142.08357972222223,42.60335277777778,55.23],[142.08284194444445,42.60260666666667,54.49],[142.08350611111112,42.60317444444445,54.58],[142.08350666666666,42.60290833333333,53.57],[142.0829411111111,42.602626111111114,57.01],[142.0835275,42.6028875,55.6],[142.0835975,42.603343055555555,54],[142.08283,42.60290583333334,54.04],[142.08285833333332,42.60286416666667,53.02],[142.08375777777778,42.60314666666667,51.56],[142.08336250000002,42.60280888888889,54.37],[142.08368583333333,42.603234722222226,55.26],[142.0838225,42.60306583333333,53.49],[142.0835727777778,42.60290527777778,56.18],[142.08365666666668,42.60327083333333,54.35],[142.08393416666667,42.603205,53.87],[142.08343916666666,42.60325944444445,53.07],[142.08363055555557,42.60293527777778,55.27],[142.08363833333334,42.60301138888889,52.95],[142.08299083333333,42.602987222222225,53.15],[142.08345277777778,42.603297500000004,55.35],[142.08284722222223,42.603025,55.92],[142.08290888888888,42.60304888888889,55.82],[142.08342027777778,42.603275833333335,54.86],[142.08334083333335,42.603102222222226,52.37],[142.08317444444444,42.60303777777778,54.19],[142.08330027777777,42.60314833333334,52.65],[142.08326888888888,42.60318361111111,54.5],[142.08367805555557,42.60295444444444,54.28],[142.08327722222222,42.602914166666665,54.19],[142.08279527777776,42.60299527777778,55.91],[142.08298166666665,42.602715,52.5],[142.0831413888889,42.60307388888889,52.36],[142.08295944444444,42.6030225,52.14],[142.08311083333334,42.603116666666665,52.86],[142.08284527777778,42.60259111111111,55.73],[142.0833736111111,42.60306611111111,53.13],[142.08352222222223,42.60333027777778,55.27],[142.08326027777778,42.60276888888889,55.09],[142.08320833333332,42.603186666666666,56.57],[142.08324916666666,42.603207777777776,56.69],[142.08320805555556,42.60274805555556,56.21],[142.08314944444444,42.60316027777778,56.38],[142.0828897222222,42.602826944444445,53.6],[142.08292444444444,42.602788611111116,53],[142.0833391666667,42.60283777777778,52.32],[142.08302333333333,42.60266722222222,53.49],[142.0834702777778,42.60295305555556,52.55],[142.08400527777778,42.603119722222225,52.39],[142.08397666666667,42.603158055555554,53.38],[142.08288833333333,42.602604444444445,57.16],[142.0826813888889,42.60281444444445,53.94],[142.08343416666668,42.60299138888889,53.07],[142.08264944444443,42.602854722222226,54.89],[142.08340416666667,42.603028611111114,54.29],[142.08372555555556,42.60318166666667,53.99],[142.08300305555557,42.602654722222226,56.11],[142.08331027777777,42.602873888888894,53.7],[142.083625,42.60330861111111,53.97],[142.08395611111112,42.60307666666667,55.8]];

internals.CanvasSystem = new PhotosetGrapher('graph-1');
internals.CanvasSystem.configure({scale: 16});
// internals.CanvasSystem.boot(d3Target, sample, [0,0,0]);
internals.CanvasSystem.boot(d3Target, sample, [42.60278027777778, 142.08271, 27.153865699049703]);

