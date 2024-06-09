'use client'
import Image from "next/image";
import styles from "./page.module.css";
import { APIProvider, AdvancedMarker, Map } from '@vis.gl/react-google-maps';
import React from "react";
import { Audi, EzVolt, EzVoltLocation, EzVoltPin, EzVoltTariff, Marker, Tupi, Volvo, YellotMob, Zletric } from "./types";
import { MarkerWithInfo } from "./markerWithInfo";

const apis = {
  ezVolt: {
    url: 'https://ezvolt.eu.charge.ampeco.tech/api/v2/app/pins',
    method: 'get',
    params: {
      includeAvailability: 'true',
    }
  },
  ezVoltDetails: {
    url: 'https://ezvolt.eu.charge.ampeco.tech/api/v2/app/locations',
    method: 'post',

  },
  tupiLong: {
    url: 'http://api.tupinambaenergia.com.br/stations',
    method: 'get',
  },
  tupiShort: {
    url: 'http://api.tupinambaenergia.com.br/stationsShortVersion',
    method: 'get',
  },
  tupiDetails: {
    url: 'http://api.tupinambaenergia.com.br/station/:stationID',
    method: 'post',
  },
  zletric: {
    url: 'http://backend.zletric.com.br/webadmin/mapajson',
    method: 'post',
    body: {
      token: "52yKmFhNb1ihySI0XTVWHcmZk03300+WJgUO8LySgzQON+6ywWAV4YJefGiU0Nm0DalOgbfzCkPlTtEUyDJRUWsufRjtK4xscekXkqhAM5E=",
      requestType: "getDevicesList"
    },
    headers: {
      'Content-Type': 'application/json',
      'Referer': 'https://backend.zletric.com.br/webadmin/mapa'
    },
    params: {
      serviceMethod: 'GET',
      serviceReferer: 'https://backend.zletric.com.br/webadmin/mapa'
    }
  },
  audi: {
    url: 'http://audimapadecarregadores.netlify.app/new-datas.js',
    method: 'get',
  },
  yellotMob: {
    url: 'https://yellotmob.com.br//wp-json/api/v1/buscar-estacoes',
    method: 'get',
    params: {
      cargaRapida: 'true',
      cargaConvencional: 'true',
    }
  },
  volvoAc: {
    url: 'https://eletropostosvolvocars.com.br/api/cargadores-ac',
    method: 'get',
  },
  volvoDc: {
    url: 'https://eletropostosvolvocars.com.br/api/cargadores-dc',
    method: 'get',
  },
  greenMobility: {
    url: 'https://api.greenmobility.com.br/stations',
    method: 'get',
  },
  greenMobilityDetails: {
    url: 'https://api.greenmobility.com.br/station/:stationID',
    method: 'post',
  },
  evStation: {
    url: 'https://api.evstation.com.br/stations',
    method: 'get',
  },
  evStationDetails: {
    url: 'https://api.evstation.com.br/station/:stationID',
    method: 'post',
  },
  evStationStatus: {
    url: 'https://api.evstation.com.br/station/:stationID/status',
    method: 'post',
  },
  evStationPrice: {
    url: 'https://api.evstation.com.br/station/:stationID/price',
    method: 'post',
  },
  evStationPayment: {
    url: 'https://api.evstation.com.br/station/:stationID/payment',
    method: 'post',
  },
  evStationRating: {
    url: 'https://api.evstation.com.br/station/:stationID/rating',
    method: 'post',
  },
  evStationComment: {
    url: 'https://api.evstation.com.br/station/:stationID/comment',
    method: 'post',
  },
  evStationPhoto: {
    url: 'https://api.evstation.com.br/station/:stationID/photo',
    method: 'post',
  },
  evStationReport: {
    url: 'https://api.evstation.com.br/station/:stationID/report',
    method: 'post',
  },
  evStationFavorite: {
    url: 'https://api.evstation.com.br/station/:stationID/favorite',
    method: 'post',
  },
  evStationCheckin: {
    url: 'https://api.evstation.com.br/station/:stationID/checkin',
    method: 'post',
  },
  evStationCheckout: {
    url: 'https://api.evstation.com.br/station/:stationID/checkout',
    method: 'post',
  },
  evStationHistory: {
    url: 'https://api.evstation.com.br/station/:stationID/history',
    method: 'post',
  },
  evStationSearch: {
    url: 'https://api.evstation.com.br/station/search',
    method: 'post',
  },
  iternio: {
    url: 'https://api.iternio.com/1/get_chargers',
    method: 'get',
    headers: {
      'Authorization': 'APIKEY f4128c06-5e39-4852-95f9-3286712a9f3a'
    }
  },
  plugShare: {
    url: 'http://api.plugshare.com/v3/config',
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic d2ViX3YyOkVOanNuUE54NHhXeHVkODU='
    },
    params: {
      country_code: 'BR',
      locale_version: '2'
    }
  }
};

export default function Home() {
  // get the user's location
  const [location, setLocation] = React.useState({ lat: -23.5411284, lng: -46.6415811 });
  const [ezVolt, setEzVolt] = React.useState<Array<Marker>>([]);
  const [ezVoltPins, setEzVoltPins] = React.useState<Array<EzVoltPin>>([]);
  const [tupi, setTupi] = React.useState<Array<Marker>>([]);
  const [zletric, setZletric] = React.useState<Array<Marker>>([]);
  const [audi, setAudi] = React.useState<Array<Marker>>([]);
  const [yellotMob, setYellotMob] = React.useState<Array<Marker>>([]);
  const [volvoAC, setVolvoAC] = React.useState<Array<Marker>>([]);
  const [volvoDC, setVolvoDC] = React.useState<Array<Marker>>([]);
  // const [iternio, setIternio] = React.useState<Array<Marker>>([]);
  // const [plugShare, setPlugShare] = React.useState<Array<Marker>>([]);

  const getPosition = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  };

  const getUrl = (toUrl: string, receivedQuery?: any) => {
    let query = {
      serviceUrl: toUrl,
    };
    if (receivedQuery) {
      query = { ...query, ...receivedQuery };
    }
    let url = new URL('/api/proxy', window.location.href);
    url.search = new URLSearchParams(query).toString();
    return url.toString();
  }

  const getEzVolt = (ezVoltPins: EzVoltPin[]) => {
    if (ezVoltPins.length === 0) {
      return;
    }
    const ids = ezVoltPins.map((pin: { id: number }) => pin.id)
    const body: { locations: any } = {
      locations: {
      },
    }
    for (let id of ids) {
      body.locations['' + id] = null
    }
    fetch(getUrl(apis.ezVoltDetails.url), {
      method: apis.ezVoltDetails.method,
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data: EzVolt) => {
        console.log('EzVolt:', data);
        setEzVolt(data.locations.map((ezVolt) => ezVoltToMarker(ezVolt, data.tariffs)));
      });
  };


  const getEzVoltPin = () => {
    fetch(getUrl(apis.ezVolt.url), {
      method: apis.ezVolt.method,
    })
      .then((response) => response.json())
      .then((data) => {
        data = data.pins;
        console.log('EzVolt Pins:', data);
        setEzVoltPins(data);
        getEzVolt(data);
      });
  };

  const ezVoltPinToMarker = (pin: EzVoltPin): Marker => {
    const location = pin.geo.split(',').map((coord) => parseFloat(coord));
    const marker: Marker = {
      position: {
        lat: location[0],
        lng: location[1],
      },
      plugs: [],
    };
    for (let i = 0; i < pin.av.ava; i++) {
      marker.plugs.push({
        id: i,
        brand: 'EZ Volt',
        status: 'available',
      });
    }
    for (let i = 0; i < pin.av.unk; i++) {
      marker.plugs.push({
        id: i,
        brand: 'EZ Volt',
        status: 'unknown',
      });
    }
    for (let i = 0; i < pin.av.una; i++) {
      marker.plugs.push({
        id: i,
        brand: 'EZ Volt',
        status: 'busy',
      });
    }
    // marker.status is available if at least one plug is available, busy if all plugs are busy or unknown and unknown if all plugs are unknown
    marker.status = marker.plugs.some((plug) => plug.status === 'available') ? 'available' : marker.plugs.some((plug) => plug.status === 'busy') ? 'busy' : 'unknown';
    return marker;
  }

  const ezVoltToMarker = (ezVolt: EzVoltLocation, tariffs: EzVoltTariff[]): Marker => {
    const marker: Marker = {
      position: {
        lat: parseFloat(ezVolt.location.split(',')[0]),
        lng: parseFloat(ezVolt.location.split(',')[1]),
      },
      address: ezVolt.address,
      name: ezVolt.name,
      description: ezVolt.description,
      plugs: [],
    };
    for (let zone of ezVolt?.zones) {
      for (let evse of zone?.evses) {
        const tariff = tariffs.find((tariff) => tariff.id === evse.tariffId);
        marker.plugs.push({
          id: evse.id,
          brand: 'EZ Volt',
          status: evse?.status === 'available' ? 'available' : evse.status === 'unavailable' ? 'busy' : 'unknown',
          maxPower: evse?.maxPower / 1000,
          type: evse?.conectors?.map((value) => value?.name?.toLowerCase()?.replaceAll('-', '')?.replaceAll('_', '')?.replaceAll(' ', '') as "type1" | "type2" | "ccs" | "ccs1" | "ccs2" | "chademo" | "tesla" | "nema" | "j1772" | "schuko" | "cee" | "other" | "unknown"),
          price: tariff ? [
            {
              currency: tariff?.currencyCode,
              value: tariff?.priceForEnergy,
              unit: 'kwh',
            }
          ] : undefined,
        });
      }
    }
    marker.status = marker.plugs.some((plug) => plug.status === 'available') ? 'available' : marker.plugs.some((plug) => plug.status === 'busy') ? 'busy' : 'unknown';
    return marker;
  }

  const zletricToMarker = (station: Zletric): Marker => {
    const marker: Marker = {
      position: {
        lat: station.latitude,
        lng: station.longitude,
      },
      address: station.address,
      name: station.title,
      description: station.description,
      plugs: [],
      isPrivate: station.private,
    };
    marker.plugs.push({
      id: 1,
      brand: 'Zletric',
      isPrivate: station.private,
      status: station.available ? 'available' : station.device_status === 'Disponível' ? 'busy' : 'unknown',
      maxPower: station.power,
      type: station.conector_type?.toLowerCase()?.replaceAll('-', '')?.replaceAll('_', '')?.replaceAll(' ', '') as "type1" | "type2" | "ccs" | "ccs1" | "ccs2" | "chademo" | "tesla" | "nema" | "j1772" | "schuko" | "cee" | "other" | "unknown",
      rating: station.rate,
      pictures: station.pictures,
    });
    marker.status = marker.plugs.some((plug) => plug.status === 'available') ? 'available' : marker.plugs.some((plug) => plug.status === 'busy') ? 'busy' : 'unknown';
    return marker;
  }

  const tupiToMarker = (station: Tupi): Marker => {
    const marker: Marker = {
      position: {
        lat: station.lat,
        lng: station.lng,
      },
      address: station.address,
      name: station.name,
      description: station.address2.city,
      plugs: [],
      isPrivate: station.private,
    };
    // merge plugs from station.plugs and station.conectedPlugs comparing name
    let plugs = station.plugs.map((plug, index) => {
      const conectedPlug = station.conectedPlugs.find((conectedPlug) => conectedPlug.name === plug);
      return conectedPlug ? { ...conectedPlug } : {
        name: plug,
        stateName: "",
        plug_id: 'unknown-' + index,
      };
    });
    plugs = [...plugs, ...station.conectedPlugs];
    // remove duplicates using plug_id
    plugs = plugs.filter((plug, index, self) => self.findIndex((p) => p.plug_id === plug.plug_id) === index);
    marker.plugs = plugs.map((plug, index) => {
      return {
        id: index,
        brand: 'Tupi',
        isPrivate: station.private,
        status: plug.stateName === 'Available' ? 'available' : plug.stateName === 'Unavailable' ? 'busy' : 'unknown',
        type: plug.name.toLowerCase().replaceAll('-', '').replaceAll('_', '').replaceAll(' ', '') as "type1" | "type2" | "ccs" | "ccs1" | "ccs2" | "chademo" | "tesla" | "nema" | "j1772" | "schuko" | "cee" | "other" | "unknown",
      };
    });
    marker.status = marker.plugs.some((plug) => plug.status === 'available') ? 'available' : marker.plugs.some((plug) => plug.status === 'busy') ? 'busy' : 'unknown';
    return marker;
  }

  const audiToMarker = (station: Audi): Marker => {
    const marker: Marker = {
      position: {
        lat: station.coordenadas.latitude,
        lng: station.coordenadas.longitude,
      },
      address: station.endereco,
      name: station.nome,
      description: station.local,
      plugs: [],
    };
    let power: number | undefined = parseFloat(station.potencia?.toLowerCase()?.replace(' kw', '') || '0');
    power = power > 0 ? power : undefined;
    marker.plugs.push({
      id: 1,
      brand: 'Audi',
      status: 'unknown',
      maxPower: power,
    });
    marker.status = marker.plugs.some((plug) => plug.status === 'available') ? 'available' : marker.plugs.some((plug) => plug.status === 'busy') ? 'busy' : 'unknown';
    return marker;
  }

  const yellotMobToMarker = (station: YellotMob): Marker => {
    const marker: Marker = {
      position: {
        lat: parseFloat(station.lat),
        lng: parseFloat(station.lng),
      },
      address: station.cidade,
      name: station.nome,
      description: station.potencia,
      plugs: [],
    };
    marker.plugs.push({
      id: 1,
      brand: 'Yellot Mob',
      status: 'unknown',
      maxPower: parseFloat(station.potencia),
      price: [{
        currency: 'BRL',
        value: parseFloat(station.valor),
        unit: 'kwh',
      }],
    });
    marker.status = marker.plugs.some((plug) => plug.status === 'available') ? 'available' : marker.plugs.some((plug) => plug.status === 'busy') ? 'busy' : 'unknown';
    return marker;
  }

  const volvoToMarker = (station: Volvo): Marker => {
    const marker: Marker = {
      position: {
        lat: parseFloat(station.lat),
        lng: parseFloat(station.lng),
      },
      address: station.address,
      name: station.name,
      description: station.quote,
      plugs: [],
    };
    marker.plugs.push({
      id: 1,
      brand: 'Volvo',
      status: 'unknown',
      currentType: station.idcarregadores_ac ? 'ac' : station.idcarregadores_dc ? 'dc' : 'unknown',
    });
    marker.status = marker.plugs.some((plug) => plug.status === 'available') ? 'available' : marker.plugs.some((plug) => plug.status === 'busy') ? 'busy' : 'unknown';
    return marker;
  }

  const getTupiLong = () => {
    fetch(apis.tupiLong.url, {
      method: apis.tupiLong.method,
    })
      .then((response) => {
        console.log('TUPI LONG:', response);

        return response.json();
      })
      .then((data: Tupi[]) => {
        console.log('Tupi:', data);
        setTupi(data.map(tupiToMarker));
      });
  };

  const getZletric = () => {
    const body = apis.zletric.body;

    fetch(getUrl(apis.zletric.url, apis.zletric.params), {
      method: apis.zletric.method,
      body: JSON.stringify(body),
      headers: apis.zletric.headers,
      redirect: 'follow',
    })
      .then((response) => {
        console.log('Zletric R:', response);
        return response.json();
      }).then((data: { data: Zletric[] }) => {
        const zletric = data.data;
        console.log('Zletric:', zletric);
        setZletric(zletric.map(zletricToMarker));
      });
  };

  const getAudi = () => {
    fetch(getUrl(apis.audi.url), {
      method: apis.audi.method,
    })
      .then((response) => {
        console.log('Audi R:', response);
        return response.json();
      })
      .then((data: { datas: Audi[] }) => {
        const audi = data.datas;
        console.log('Audi:', audi);
        setAudi(audi.map(audiToMarker));
      });
  };

  const getYellotMob = () => {
    fetch(getUrl(apis.yellotMob.url, apis.yellotMob.params), {
      method: apis.yellotMob.method,
    })
      .then((response) => response.json())
      .then((data: YellotMob[]) => {
        console.log('YellotMob:', data);
        setYellotMob(data.map(yellotMobToMarker));
      });
  };

  const getVolvoAc = () => {
    fetch(apis.volvoAc.url, {
      method: apis.volvoAc.method,
    })
      .then((response) => response.json())
      .then((data: { cargadoresac: Volvo[] }) => {
        const volvo = data.cargadoresac;
        console.log('Volvo AC:', volvo);
        setVolvoAC(volvo.map(volvoToMarker));
      });
  };

  const getVolvoDc = () => {
    fetch(apis.volvoDc.url, {
      method: apis.volvoDc.method,
    })
      .then((response) => response.json())
      .then((data: { cargadoresdc: Volvo[] }) => {
        const volvo = data.cargadoresdc;
        console.log('Volvo DC:', volvo);
        setVolvoDC(volvo.map(volvoToMarker));
      });
  };

  const getAll = () => {
    getPosition();
    getEzVoltPin();
    getTupiLong();
    getZletric();
    getAudi();
    getYellotMob();
    getVolvoAc();
    getVolvoDc();
  }

  React.useEffect(() => {
    getAll();
  }, []);

  // update the user's location every 10 seconds

  React.useEffect(() => {
    const id = setInterval(getAll, 30000);
    return () => clearInterval(id);
  }, []);

  // React.useEffect(() => {
  //   const body = {
  //     "lat": location.lat,
  //     "lon": location.lng,
  //     "types": [],
  //     "radius": 51256.91696628168,
  //     "limit": 500,
  //     "sort_by_power": true,
  //     "sort_by_distance": true,
  //     "get_status": true
  //   }
  //   fetch(apis.iternio.url, {
  //     method: apis.iternio.method,
  //     headers: apis.iternio.headers,
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log('Iternio:', data);
  //       setIternio(data);
  //     });
  // }, []);

  // React.useEffect(() => {
  //   fetch(getUrl(apis.plugShare.url), {
  //     method: apis.plugShare.method,
  //     headers: apis.plugShare.headers,
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data);
  //       setPlugShare(data);
  //     });
  // }, []);
  const userMarkerImg = '/user.png';


  const advancedMarker = (marker: Marker, index: number) => {
    if (marker.position)
      return (
        <MarkerWithInfo key={index} position={marker.position} markerConf={marker}/>
      );
  };

  const userMarker = () => {
    return (
      <AdvancedMarker position={location}>
        <img src={userMarkerImg} width={32} height={32} />
      </AdvancedMarker>
    );
  }

  return (
    <main className={styles.main}>
      <APIProvider apiKey={"AIzaSyDTrUbqr2Yglzf138HBZAiU48Hnvpk7mvg"}>
        <Map
          id="map"
          mapId={'bf51a910020fa25a'}
          style={{ width: '100vw', height: '100vh' }}
          defaultCenter={location}
          defaultZoom={15}
          gestureHandling={'greedy'}
          disableDefaultUI={true}

        >
          {userMarker()}
          {ezVolt.map(advancedMarker)}
          {tupi.map(advancedMarker)}
          {zletric.map(advancedMarker)}
          {audi.map(advancedMarker)}
          {yellotMob.map(advancedMarker)}
          {volvoAC.map(advancedMarker)}
          {volvoDC.map(advancedMarker)}
          {/* {iternio.map(advancedMarker)}
          {plugShare.map(advancedMarker)} */}
        </Map>
      </APIProvider>
    </main>);
}
