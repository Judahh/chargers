type EzVoltPin = {
    id: number;
    geo: string;
    av: {
        ava: number;
        unk: number;
        una: number;
    }
};

type EzVoltLocation = {
    id: number;
    name: string;
    address: string;
    description: string;
    additional_description: string;
    detailed_description: string;
    location: string;
    location_image: string;
    timezone: string;
    updatedAt: Date | string;
    what3words_address: string;
    workingHours: [];
    zones: Array<{
        evses: Array<{
            id: number;
            identifier: string;
            networkId: string;
            canReserve: boolean;
            capabilities: string;
            conectors: Array<{
                name: string;
                icon: string;
                format: string;
                status: "active" | "inactive" | "unknown" | "unavailable";
            }>;
            corporateBillingAsDefaultPaymentMethod: boolean;
            currentType: string;
            emi3Identifier: string;
            hasParkingBarrier: boolean;
            hasSmartCharging: boolean;
            isAvailable: boolean;
            isLongTermUnavailable: boolean;
            isTemporarilyUnavailable: boolean;
            managedByOperator: boolean;
            maxPower: number;
            midMeterCertificationEndYear: number;
            operatedBy: string;
            qrUrl: string;
            reservationId: string;
            roamingEvseId: string;
            socPercent: number;
            status: 'available' | 'unavailable' | 'unknown';
            tariffId: string;
        }>;
    }>;
};

type EzVoltCurrency = {
    id: number;
    name: string;
    symbol: string;
    code: string;
    formatter: string;
    hasPrefix: boolean;
    hasSuffix: boolean;
    minorUnitDecimal: number;
    prefix: string;
    sign: string;
    suffix: string;
    unitPriceFormatter: string;
    updatedAt: Date | string;
};

type EzVoltTariff = {
    id: string;
    currencyCode: string;
    description: string;
    additionalInformation: string;
    conectionFee: number;
    conectionFeeGracePeriodKwh: number;
    conectionFeeGracePeriodMinutes: number;
    defaultChargeByTime: number;
    defaultTopUpKwh: number;
    durationFeeFrom: number;
    durationFeeGracePeriod: number;
    durationFeeTo: number;
    idleFeeGracePeriodMinutes: number;
    isAdHoc: boolean;
    learnMoreUrl: string;
    minPrice: number;
    offPeakHoursLabel: string;
    optimizedLabel: string;
    optimizedTariffEnd: string;
    optimizedTariffStart: string;
    peakHoursLabel: string;
    powerLevels: unknown;
    priceForDuration: number;
    priceForDurationAtDay: number;
    priceForDurationAtNight: number;
    priceForEnergy: number;
    priceForEnergyAtDay: number;
    priceForEnergyAtNight: number;
    priceForEnergyWhenOptimized: number;
    priceForIdle: number;
    priceForIdleAtDay: number;
    priceForIdleAtNight: number;
    priceForSession: number;
    pricePeriods: unknown;
    priceType: string;
    pricingPeriodInMinutes: number;
    referenceRange: number;
    regularUseMinutes: number;
    standardTariffDurationFee: number;
    standardTariffDurationLastUnit: number;
    standardTariffFeePerKwh: number;
    standardTariffIdleFee: number;
};

type EzVolt = {
    currencies: Array<EzVoltCurrency>;
    locations: Array<EzVoltLocation>,
    tariffs: Array<EzVoltTariff>;
};

type YellotMob = {
    id: number;
    nome: string;
    lat: string;
    lng: string;
    cidade: string;
    potencia: string;
    potenciaFormatado: string;
    tipoDeCarga: string;
    tipoDeConector: string;
    valor: string;
    valorFormatado: string;
}

type Zletric = {
    id: number;
    location_id: number;
    sigfox_device_id: string;
    address: string;
    available: boolean;
    charge_status_id: number;
    conector_type: string;
    conector_type_id: number;
    description: string;
    device_status: string;
    device_status_id: number;
    latitude: number;
    longitude: number;
    pictures: Array<string>;
    power: number;
    power_type: string;
    private: boolean;
    product_id: number;
    protocol: string;
    rate: number;
    schedule: string;
    title: string;
};

type Volvo = {
    idcarregadores_ac?: number;
    idcarregadores_dc?: number;
    name: string;
    address: string;
    activo: boolean;
    lat: string;
    lng: string;
    url_google: string;
    quote: string;
};

type Audi = {
    regiao: string;
    estado: string;
    nome: string;
    coordenadas: {
        latitude: number;
        longitude: number;
    };
    endereco: string;
    local: string;
    observacao: string;
    potencia: string;
    quantidade: number;
    rota: string;
}

type Tupi = {
    id: number;
    name: string;
    lat: number;
    lng: number;
    _v: string;
    _id: string;
    acceptCoupon: boolean;
    address: string;
    address2: {
        _id: string;
        _v: string;
        station_id: string;
        city: string;
        createdAt: string | Date;
        updatedAt: string | Date;
        state: string;
        businessHours: string;
        businessHoursPeriod: {
            holidaysHours: string;
            timezone: string;
        };
    }
    canReserve: boolean;
    centralSystem: string;
    companyID: string;
    contractEndedAt: string | Date;
    contractModel: string;
    contractStartedAt: string | Date;
    controller: string;
    country: string;
    createdAt: string | Date;
    currency: string;
    current: string;
    disabled: boolean;
    firstPaymentAt: string | Date;
    freeParking: boolean;
    freeVending: boolean;
    icon: string;
    installedAt: string | Date;
    kwhCostValue: number;
    kwhTariffValue: number;
    language: string;
    operationStarteAt: string | Date;
    parentCompanyID: string;
    partnerInstallerName: string;
    payment: {
        enabled: boolean;
        value: number;
        _id: string;
    };
    paymentCharge: {
        enabled: boolean;
        value: number;
        _id: string;
        description: string;
        method: string;
    };
    phone: string;
    photo: string;
    plugs: string[];
    conectedPlugs: {
        power: number,
        current: string,
        stateName: "Available" | "Unavailable" | "",
        connectorID: number,
        startConnectorID: 1,
        startedUserID: string
        startExpiresOn: Date | string;
        reservedUserID: string;
        reserveExpiresOn: Date | string;
        plug_id: string;
        startChargingOn: Date | string;
        name: string;
    }[];
    posPayment: boolean;
    position: {
        lat: string;
        lng: string;
    };
    power: string;
    private: boolean;
    remunarationEnergy: string;
    remunarationMedia: string;
    reserveExpiresOn: string | Date;
    reserveUserID: string;
    rules: {
        nfse: {
            enabled: boolean;
        };
    };
    sanitizedStationId: string;
    splitRemunarationMedia: Array<string>;
    startExpiresOn: string | Date;
    startedUserID: string;
    stateName: "Available" | "Unavailable" | "";
    stationFlags: unknown;
    stationID: string;
    stationParkingSpot: number;
    stationPartners: [];
    systemUpkeep: boolean;
    test: boolean;
    tupiInstall: null;
    tupiPlug: null;
    updatedAt: string | Date;
    upkeep: boolean;
    visibility: boolean;
}

type Marker = {
    id?: string;
    isPrivate?: boolean;
    position?: { lat: number, lng: number };
    address?: string;
    name?: string;
    description?: string;
    rating?: number;
    totalRatings?: number;
    status?: "available" | "busy" | "unknown" | "offline";
    parking?: {
        isFree?: boolean;
        price?: Array<{
            currency?: string,
            value?: number;
            unit?: "hour" | "session" | "kwh" | "minute" | "day";
        }>
    };
    pictures?: Array<string>;
    plugs: Array<{
        id?: string | number,
        isPrivate?: boolean;
        brand?: string,
        rating?: number;
        totalRatings?: number;
        maxPower?: number,
        currentType?: "ac" | "dc" | "ac/dc" | "unknown"
        type?: "type1" | "type2" | "ccs" | "ccs1" | "ccs2" | "chademo" | "tesla" | "nema" | "j1772" | "schuko" | "cee" | "other" | "unknown" | Array<"type1" | "type2" | "ccs" | "ccs1" | "ccs2" | "chademo" | "tesla" | "nema" | "j1772" | "schuko" | "cee" | "other" | "unknown">;
        status?: "available" | "busy" | "unknown" | "offline";
        isFree?: boolean;
        price?: Array<{
            currency?: string,
            value?: number;
            unit?: "hour" | "session" | "kwh" | "minute" | "day";
        }> | undefined;
        reservationQueue?: Array<{
            id?: string | number;
            userId?: string;
            startedAt?: Date;
            expiresAt?: Date;
        }>;
        endsAt?: Date;
        pictures?: Array<string>;
    }>;
    reservationQueue?: Array<{
        id?: string | number;
        userId?: string;
        startedAt?: Date;
        expiresAt?: Date;
    }>;
    endsAt?: Date;
};

export type { EzVoltPin, EzVoltLocation, EzVoltCurrency, EzVoltTariff, EzVolt, YellotMob, Zletric, Volvo, Audi, Tupi, Marker };