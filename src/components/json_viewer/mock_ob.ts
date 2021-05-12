import { KCWIAcquisition, KCWIScience } from './../../typings/papahana.d';
import { ObservationBlock, Science, Acquisition, Signature, Target, Magnitude, Observation } from './../../typings/papahana'

export const mock_signature: Signature = {
        "pi_id": "George Michael Bluth",
        "sem_id": [
            "2027B"
        ],
        "instrument": "KCWI",
        "program": 3,
        "observers": [
            "Mort Meyers",
            "Mark Cherry",
            "Lupe",
            "Ann Veal",
            "Rita Leeds"
        ],
        "comment": "I don’t understand the question and I won’t respond to it."
    }

export const mock_magnitude: Magnitude = {
    "band" : "hg",
    "magnitude" : 1.4813954055593237,
    "comment" : "I hear the jury’s still out on science."
}

export const mock_target: Target = {
		"name" : "fvpp",
		"ra" : "316 39 13",
		"dec" : "+51 45 04",
		"equinox" : 1.0575295061399248,
		"frame" : "idjp",
		"ra_offset" : 1.8940544757767575,
		"dec_offset" : 9.644326287133682,
		"pa" : 75,
		"pm_ra" : 7.660307928721236,
		"pm_dec" : 8.536594065719449,
		"epoch" : 3.847604787012253,
		"obstime" : 8.138445169518556,
		"mag" : [ mock_magnitude ],
		"wrap" : "jwit",
		"d_ra" : 8.816700458921668,
		"d_dec" : 1.466111521240504,
		"comment" : "I’m a scholar. I enjoy scholarly pursuits."
}

export const mock_science: KCWIScience = {
        "name": "cornballer",
        "version": "0.1",
        "det1_exptime": 643,
        "det1_nexp": 46,
        "det2_exptime": 3074,
        "det2_nexp": 11,
        "cfg_cam_grating": "BH1",
        "cfg_cam_cwave": 8989,
        "cfg_slicer": "Medium"
}

export const mock_acquisition: KCWIAcquisition = {
        "name": "KCWI_ifu_acq_direct",
        "version": "0.1",
        "script": "KCWI_ifu_acq_direct",
        "guider_po": "IFU",
        "guider_gs_ra": 10.670340991407633,
        "guider_gs_dec": 937.6613285158958,
        "guider_gs_mode": "Operator"
}

export const mock_ob: ObservationBlock = {
  '_id': "1_mock",
  'version': '0.1',
  'signature': mock_signature, 
  'target': mock_target,
  'acquisition': mock_acquisition,
  'science': [mock_science],
  'observation_type': ['asdfe'],
  'priority': 46.00345040437236,
  "status": "completed",
  "comment": "I hear the jury’s still out on science.",
  "associations": [
        "czlem",
        "kxlmk",
        "ihhnr",
        "jhick"
    ],
}