'use client'
import Image from "next/image";
import styles from "./page.module.css";
import { APIProvider, AdvancedMarker, Map, MapCameraChangedEvent } from '@vis.gl/react-google-maps';
import React from "react";
import { Audi, EzVolt, EzVoltLocation, EzVoltPin, EzVoltTariff, Marker, MarkerFilter, Tupi, Volvo, YellotMob, Zletric } from "./types";
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
    url: 'https://api.tupinambaenergia.com.br/stations',
    method: 'get',
  },
  tupiShort: {
    url: 'https://api.tupinambaenergia.com.br/stationsShortVersion',
    method: 'get',
  },
  tupiDetails: {
    url: 'https://api.tupinambaenergia.com.br/station/:stationID',
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
  const [camera, setCamera] = React.useState<{
    center: google.maps.LatLngLiteral;
    bounds?: google.maps.LatLngBoundsLiteral;
    zoom: number;
    heading?: number;
    tilt?: number;
  }>({ center: { lat: -23.5411284, lng: -46.6415811 }, zoom: 15 });
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
  const [markers, setMarkers] = React.useState<Array<Marker>>([]);
  let tempMarkers: Array<Marker> = [];
  const [filteredMarkers, setFilteredMarkers] = React.useState<Array<Marker>>([]);
  const [filter, setFilter] = React.useState<MarkerFilter>({} as MarkerFilter);
  const [menu, setMenu] = React.useState<boolean>(false);
  const [empty, setEmpty] = React.useState<boolean>(true);
  let tempEmpty = true;

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

  const getZipCodeFromAddress = (address?: string) => {
    if (!address) {
      return undefined;
    }
    const zipCode = address.match(/\d{5}-\d{3}|\d{8}|\d{5}-\d{2}|\d{5}/g);
    return zipCode ? zipCode[0] : '';
  }

  const ezVoltPinToMarker = (pin: EzVoltPin): Marker => {
    const location = pin.geo.split(',').map((coord) => parseFloat(coord));
    const marker: Marker = {
      api: 'ezvolt',
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
      api: 'ezvolt',
      position: {
        lat: parseFloat(ezVolt.location.split(',')[0]),
        lng: parseFloat(ezVolt.location.split(',')[1]),
      },
      address: ezVolt.address,
      zipCode: getZipCodeFromAddress(ezVolt.address),
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
      api: 'zletric',
      position: {
        lat: station.latitude,
        lng: station.longitude,
      },
      address: station.address,
      zipCode: getZipCodeFromAddress(station.address),
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
      api: 'tupi',
      position: {
        lat: station?.lat,
        lng: station?.lng,
      },
      address: station?.address,
      zipCode: getZipCodeFromAddress(station?.address),
      name: station?.name,
      description: station?.address2?.city,
      plugs: [],
      isPrivate: station?.private,
    };
    // merge plugs from station.plugs and station.conectedPlugs comparing name
    let plugs = station.plugs.map((plug, index) => {
      const conectedPlug = station?.conectedPlugs?.find((conectedPlug) => conectedPlug?.name === plug);
      return conectedPlug ? { ...conectedPlug } : {
        name: plug,
        stateName: "",
        plug_id: 'unknown-' + index,
      };
    });
    plugs = [...plugs, ...(station?.conectedPlugs || [])];
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
      api: 'audi',
      position: {
        lat: station.coordenadas.latitude,
        lng: station.coordenadas.longitude,
      },
      address: station.endereco,
      zipCode: getZipCodeFromAddress(station?.endereco),
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
      api: 'yellotmob',
      position: {
        lat: parseFloat(station.lat),
        lng: parseFloat(station.lng),
      },
      address: station.cidade,
      zipCode: getZipCodeFromAddress(station?.cidade),
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
      api: 'volvo',
      position: {
        lat: parseFloat(station.lat),
        lng: parseFloat(station.lng),
      },
      address: station.address,
      zipCode: getZipCodeFromAddress(station?.address),
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

  const getEzVolt = async (ezVoltPins: EzVoltPin[]) => {
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
    const response = await fetch(getUrl(apis.ezVoltDetails.url), {
      method: apis.ezVoltDetails.method,
      body: JSON.stringify(body),
    });
    const data: EzVolt = await response.json();
    console.log('EzVolt:', data);
    const newEzVolt = data.locations.map((ezVolt) => ezVoltToMarker(ezVolt, data.tariffs));
    setEzVolt(newEzVolt);
    return newEzVolt;
  };


  const getFullEzVolt = async () => {
    const response = await fetch(getUrl(apis.ezVolt.url), {
      method: apis.ezVolt.method,
    });
    const data: EzVoltPin[] = (await response.json()).pins;
    console.log('EzVolt Pins:', data);
    setEzVoltPins(data);
    const newEzVolt = await getEzVolt(data);
    updateIfEmpty(newEzVolt);
    return newEzVolt;
  };

  const getTupiLong = async () => {
    const response = await fetch(apis.tupiLong.url, {
      method: apis.tupiLong.method,
    });
    const data: Tupi[] = await response.json();
    console.log('Tupi:', data);
    const tupi = data.map(tupiToMarker);
    setTupi(tupi);
    updateIfEmpty(tupi);
    return tupi;
  };

  const getZletric = async () => {
    const body = apis.zletric.body;

    const response = await fetch(getUrl(apis.zletric.url, apis.zletric.params), {
      method: apis.zletric.method,
      body: JSON.stringify(body),
      headers: apis.zletric.headers,
      redirect: 'follow',
    });
    const data: Zletric[] = (await response.json()).data;
    console.log('Zletric:', data);
    const zletric = data.map(zletricToMarker);
    setZletric(zletric);
    updateIfEmpty(zletric);
    return zletric;
  };

  const getAudi = async () => {
    const response = await fetch(getUrl(apis.audi.url), {
      method: apis.audi.method,
    });
    const data: Audi[] = (await response.json()).datas;
    console.log('Audi:', data);
    const audi = data.map(audiToMarker);
    setAudi(audi);
    updateIfEmpty(audi);
    return audi;
  };

  const getYellotMob = async () => {
    const response = await fetch(getUrl(apis.yellotMob.url, apis.yellotMob.params), {
      method: apis.yellotMob.method,
    });
    const data: YellotMob[] = await response.json();
    console.log('YellotMob:', data);
    const yellotMob = data.map(yellotMobToMarker);
    setYellotMob(yellotMob);
    updateIfEmpty(yellotMob);
    return yellotMob;
  };

  const getVolvoAc = async () => {
    const response = await fetch(apis.volvoAc.url, {
      method: apis.volvoAc.method,
    });
    const data: Volvo[] = (await response.json()).cargadoresac;
    console.log('Volvo AC:', data);
    const volvo = data.map(volvoToMarker);
    setVolvoAC(volvo);
    updateIfEmpty(volvo);
    return volvo;
  };

  const getVolvoDc = async () => {
    const response = await fetch(apis.volvoDc.url, {
      method: apis.volvoDc.method,
    });
    const data: Volvo[] = (await response.json()).cargadoresdc;
    console.log('Volvo AC:', data);
    const volvo = data.map(volvoToMarker);
    setVolvoAC(volvo);
    updateIfEmpty(volvo);
    return volvo;
  };

  const getPosition = async () => {
    return new Promise<{
      lat: number,
      lng: number,
    }>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log('Position:', position);
        const l = {
          lat: Number(position.coords.latitude || 0),
          lng: Number(position.coords.longitude || 0),
        };
        // check if location changed
        if (location.lat === l.lat && location.lng === l.lng || l.lat === 0 && l.lng === 0 || l.lat == undefined && l.lng == undefined) {
          resolve(l);
          return;
        }
        setLocation(l);
        const c = {
          ...camera,
          center: l,
        };
        setCamera(c);
        resolve(l);
      });
    });
  };

  const mergeMarkers = (markers: Array<Marker[] | undefined>) => {
    const cleanedMarkers = markers.filter((marker) => marker !== undefined) as Marker[][];
    const allMarkers = cleanedMarkers.flat();
    const mergedMarkers = allMarkers.reduce<Marker[]>((acc, marker) => {
      const existingMarker = acc.find((m) => ((m?.api !== marker?.api) && ((m?.zipCode && m?.zipCode === marker?.zipCode) || (m?.position?.lat === marker?.position?.lat && m?.position?.lng === marker?.position?.lng) || (m?.name && m?.name?.toLowerCase() === marker?.name?.toLowerCase()) || (m?.address && m?.address?.toLowerCase() === marker?.address?.toLowerCase()))));
      if (marker.name?.includes('Villa Lobos')) {
        // console.log('Villa Lobos Existing:', existingMarker, 'New:', marker);
      }
      if (existingMarker) {
        // console.log('Existing:', existingMarker, 'New:', marker);
        // merge plugs field by field
        existingMarker.address = existingMarker.address || marker.address;
        existingMarker.name = existingMarker.name || marker.name;
        existingMarker.description = existingMarker.description || marker.description;
        if (existingMarker.status === 'unknown') {
          existingMarker.status = undefined;
        }
        if (marker.status === 'unknown') {
          marker.status = undefined;
        }
        existingMarker.status = existingMarker.status || marker.status;
        if (existingMarker.status == undefined) {
          existingMarker.status = 'unknown';
        }
        existingMarker.id = existingMarker.id || marker.id;
        existingMarker.endsAt = existingMarker.endsAt || marker.endsAt;
        existingMarker.isPrivate = existingMarker.isPrivate || marker.isPrivate;
        existingMarker.pictures = existingMarker.pictures || marker.pictures;
        existingMarker.parking = existingMarker.parking || marker.parking;
        existingMarker.position = existingMarker.position || marker.position;
        existingMarker.rating = existingMarker.rating || marker.rating;
        existingMarker.totalRatings = existingMarker.totalRatings || marker.totalRatings;
        existingMarker.endsAt = existingMarker.endsAt || marker.endsAt;
        // merge plugs comparing by type
        const plugs = [...existingMarker.plugs];
        for (let plug of marker.plugs) {
          const existingPlug = plugs.find((p) => p.type === plug.type);
          if (existingPlug) {
            existingPlug.brand = existingPlug.brand || plug.brand;
            existingPlug.id = existingPlug.id || plug.id;
            existingPlug.isFree = existingPlug.isFree || plug.isFree;
            existingPlug.maxPower = existingPlug.maxPower || plug.maxPower;
            existingPlug.price = existingPlug.price || plug.price;
            existingPlug.rating = existingPlug.rating || plug.rating;
            existingPlug.status = existingPlug.status || plug.status;
          } else {
            plugs.push(plug);
          }
        }
      } else {
        acc.push(marker);
      }
      return acc;
    }, []);
    return mergedMarkers;
  }

  const onCameraChanged = (newCamera: MapCameraChangedEvent) => {
    if (!newCamera.detail.zoom) {
      newCamera.detail.zoom = camera.zoom;
    }
    if (!newCamera.detail.center) {
      newCamera.detail.center = camera.center;
    }
    if (!newCamera.detail.bounds && camera.bounds) {
      newCamera.detail.bounds = camera.bounds;
    }

    setCamera(newCamera.detail);
    const filtered = filterMarkers(markers, newCamera.detail);
    setFilteredMarkers(filtered);
  }

  const filterMarkers = (markers: Marker[], camera: {
    center: google.maps.LatLngLiteral;
    bounds?: google.maps.LatLngBoundsLiteral;
    zoom: number;
    heading?: number;
    tilt?: number;
  }, filter?: MarkerFilter) => {
    // get radius using the zoom level, the center of the camera and bounds
    const radius = 10000;
    const filtered = markers.filter((marker) => {
      // do not use google.maps.geometry.spherical.computeDistanceBetween because it is not available in the browser
      if (!marker?.position) {
        return false;
      }

      if (marker?.position?.lat == undefined || marker?.position?.lng == undefined) {
        return false;
      }

      if (typeof marker?.position?.lat != 'number' || typeof marker?.position?.lng != 'number') {
        marker.position.lat = parseFloat(marker.position.lat as unknown as string);
        marker.position.lng = parseFloat(marker.position.lng as unknown as string);
      }

      if (marker?.position?.lat === 0 || marker?.position?.lng === 0) {
        return false;
      }

      if (filter) {
        if (filter.status && filter.status !== marker.status) {
          return false;
        }
        if (filter.api && (!filter.api.includes(marker.api) || filter.api !== marker.api)) {
          return false;
        }
        if (filter.isPrivate != undefined && filter.isPrivate !== marker.isPrivate) {
          return false;
        }
        if (filter.rating != undefined && filter.rating !== marker.rating) {
          return false;
        }
        if (filter.totalRatings != undefined && filter.totalRatings !== marker.totalRatings) {
          return false;
        }
        if (filter.parking != undefined) {
          if (filter.parking.isFree != undefined && filter.parking.isFree !== marker.parking?.isFree) {
            return false;
          }
        }
        if (filter.plugs) {
          const filterPlug = filter.plugs;
          const plug = marker.plugs.find((plug) => plug.type === filterPlug.type);
          if (!plug) {
            return false;
          }
          if (filterPlug.status && filterPlug.status !== plug.status) {
            return false;
          }
          if (filterPlug.brand && filterPlug.brand !== plug.brand) {
            return false;
          }
          if (filterPlug.isFree != undefined && filterPlug.isFree !== plug.isFree) {
            return false;
          }
          if (filterPlug.maxPower != undefined && filterPlug.maxPower !== plug.maxPower) {
            return false;
          }
        }
      }

      const distance = Math.sqrt((camera.center.lat - marker?.position?.lat) ** 2 + (camera.center.lng - marker?.position?.lng) ** 2);
      return distance < radius;
    });
    return filtered;
  }

  const updateIfEmpty = async (newMarkers?: Marker[]) => {
    if(!newMarkers) {
      return;
    }
    const tMakers = [...(tempMarkers||[]), ...(markers||[])];
    if (empty && tempEmpty) {
      if(tMakers.length > 0) {
        // console.log('Merge:', tMakers.length, newMarkers.length);
        newMarkers = mergeMarkers([tMakers, newMarkers]);
      } else {
        // console.log('New (No Merge):', tMakers.length, newMarkers.length);
      }
      tempMarkers = [...newMarkers];
      setMarkers(newMarkers);
      const filtered = filterMarkers(newMarkers, camera, filter);
      setFilteredMarkers(filtered);
      // console.log('New Filtered:', filtered.length);
      // console.log('New All:', newMarkers.length);
    }
  }

  const getAll = async () => {
    const position = await getPosition();
    const promises = [getFullEzVolt(), getTupiLong(), getZletric(), getAudi(), getYellotMob(), getVolvoAc(), getVolvoDc()];
    const all = await Promise.all(promises);
    const [ezVolt, tupi, zletric, audi, yellotMob, volvoAC, volvoDC] = all;
    const allMarkers = mergeMarkers([ezVolt, tupi, zletric, audi, yellotMob, volvoAC, volvoDC]);
    console.log('All:', allMarkers);
    setEmpty(false);
    tempEmpty = false;
    setMarkers(allMarkers);
    const filtered = filterMarkers(allMarkers, camera, filter);
    setFilteredMarkers(filtered);
    console.log('Filtered:', filtered.length);
    console.log('All:', allMarkers.length);
  }

  React.useEffect(() => {
    getAll();
    const id = setInterval(getAll, 60000);
    return () => clearInterval(id);
  }, []);

  React.useEffect(() => {
    const filtered = filterMarkers(markers, camera, filter);
    setFilteredMarkers(filtered);
  }, [camera, markers, filter]);

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
  const menuImg = '/filter.svg';


  const advancedMarker = (marker: Marker, index: number) => {
    if (marker.position)
      return (
        <MarkerWithInfo key={index} position={marker.position} markerConf={marker} />
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
      {/* floating menu window */}
      <div className={menu ? styles.menu : styles.menuHidden}>
        <div className={styles.menuContent}>
          <div className={styles.menuHeader}>
            <h1>Menu</h1>
            <button onClick={() => setMenu(!menu)}>X</button>
          </div>
          <div className={styles.menuBody}>
            <h2>Filtros</h2>
            <div className={styles.filter}>
              <h3>API</h3>
              <select onChange={(e) => setFilter({ ...filter, api: e.target.value as any })}>
                <option value="">Selecione</option>
                <option value="ezvolt">EZ Volt</option>
                <option value="tupi">Tupi</option>
                <option value="zletric">Zletric</option>
                <option value="audi">Audi</option>
                <option value="yellotmob">Yellot Mob</option>
                <option value="volvo">Volvo</option>
              </select>
            </div>
            <div className={styles.filter}>
              <h3>Status</h3>
              <select onChange={(e) => setFilter({ ...filter, status: e.target.value as any })}>
                <option value="">Selecione</option>
                <option value="available">Disponível</option>
                <option value="busy">Ocupado</option>
                <option value="unknown">Desconhecido</option>
              </select>
            </div>
            <div className={styles.filter}>
              <h3>Privado</h3>
              <select onChange={(e) => setFilter({ ...filter, isPrivate: e.target.value === 'true' })}>
                <option value="">Selecione</option>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>
            <div className={styles.filter}>
              <h3>Rating</h3>
              <select onChange={(e) => setFilter({ ...filter, rating: parseInt(e.target.value) })}>
                <option value="">Selecione</option>
                <option value="1">1 Estrela</option>
                <option value="2">2 Estrelas</option>
                <option value="3">3 Estrelas</option>
                <option value="4">4 Estrelas</option>
                <option value="5">5 Estrelas</option>
              </select>
            </div>
            <div className={styles.filter}>
              <h3>Total de Avaliações</h3>
              <select onChange={(e) => setFilter({ ...filter, totalRatings: parseInt(e.target.value) })}>
                <option value="">Selecione</option>
                <option value="1">1 Avaliação</option>
                <option value="2">2 Avaliações</option>
                <option value="3">3 Avaliações</option>
                <option value="4">4 Avaliações</option>
                <option value="5">5 Avaliações</option>
              </select>
            </div>
            <div className={styles.filter}>
              <h3>Estacionamento</h3>
              <select onChange={(e) => setFilter({ ...filter, parking: { isFree: e.target.value === 'true' } })}>
                <option value="">Selecione</option>
                <option value="true">Gratuito</option>
                <option value="false">Pago</option>
              </select>
            </div>
            <div className={styles.filter}>
              <h3>Tomada</h3>
              <select onChange={(e) => setFilter({ ...filter, plugs: { type: e.target.value as any } })}>
                <option value="">Selecione</option>
                <option value="type1">Tipo 1</option>
                <option value="type2">Tipo 2</option>
                <option value="ccs">CCS</option>
                <option value="ccs1">CCS1</option>
                <option value="ccs2">CCS2</option>
                <option value="chademo">Chademo</option>
                <option value="tesla">Tesla</option>
                <option value="nema">NEMA</option>
                <option value="j1772">J1772</option>
                <option value="schuko">Schuko</option>
                <option value="cee">CEE</option>
                <option value="other">Outra</option>
                <option value="unknown">Desconhecido</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <APIProvider apiKey={"AIzaSyDTrUbqr2Yglzf138HBZAiU48Hnvpk7mvg"}>
        <Map
          id="map"
          mapId={'bf51a910020fa25a'}
          style={{ width: '100vw', height: '100vh' }}
          defaultCenter={camera.center}
          defaultZoom={camera.zoom}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          onCameraChanged={onCameraChanged}
        >
          {userMarker()}
          {filteredMarkers.map(advancedMarker)}
        </Map>
      </APIProvider>
      {/* floating menu button */}
      <button className={styles.menuButton} onClick={() => setMenu(!menu)}>
        <img src={menuImg} width={32} height={32} />
      </button>
    </main>);
}
