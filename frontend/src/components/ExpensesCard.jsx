import React, {useState} from 'react';
import '../styles/components/ExpensesCard.css';

// grafico
const DonutChart = ({data, total, hoveredItem, setHoveredItem}) => {
    let porcentajeAcumulado = 0;

    // formateador estandar para los pesos
    const formatCurrency = (val) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(val);
    };

    // determinamos que mostrar en el centro del grafico
    const centerLabel = hoveredItem ? hoveredItem.name.toUpperCase(): 'TOTAL GASTADO';
    const centerValue = hoveredItem ? hoveredItem.value: total;

    return(
    <div className="chart-container">
        <svg viewBox="0 0 42 42" className="donut-svg">
        {data.map((item) => {
            const porcentaje = (item.value / total) * 100;
            const strokeDasharray = `${porcentaje} ${100 - porcentaje}`;
            const strokeDashoffset = 25 - porcentajeAcumulado;
            porcentajeAcumulado += porcentaje;
            const isHovered = hoveredItem?.id === item.id;

            return (
                <circle
                key={item.id}
                cx="21"
                cy="21"
                r="15.9155" /*este radio especifico hace que la circunferencia sea 100 exacto*/
                fill="transparent"
                stroke={item.color}
                strokeWidth={isHovered ? "4" : "2.5"} /*resalta engrosando la linea si tiene hover*/
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                onMouseEnter={() => setHoveredItem(item)}
                onMouseLeave={() => setHoveredItem(null)}
                className="donut-slice"
                />
            );
        })}
        </svg>
            <div className='donut-center-text'>
                <span className='chart-label'>{centerLabel}</span>
                <span className='chart-total'>{formatCurrency(centerValue)}</span>
        </div>
    </div>
    );
};

// fila de lista de categorias

const LegendItem = ({item, hoveredItem, setHoveredItem}) => {
    const formatCurrency = (val) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(val);
    };

    // si hay un elemento con hover y no es este, lo opacamos un poco
    const isDimmed = hoveredItem && hoveredItem.id !== item.id;

    return (
        <div className={`legend-item ${isDimmed ? 'dimmed' : ''}`} 
        onMouseEnter={() => setHoveredItem(item)}
        onMouseLeave={() => setHoveredItem(null)}>
            <div className='legend-left'>
                <span className='legend-bullet' style={{backgroundColor: item.color}}></span>
                <span className='legend-name'>{item.name}</span>
            </div>    
                <span className='legend-value'>{formatCurrency(item.value)}</span>
        </div>
    );
};

// componente principal exportado
const ExpensesCard = ({data}) => {
    // suma total automatizada de todos los montos
    const totalExpenses = data.reduce((sum, item) => sum + item.value, 0);
    // estado para controlar donde esta el mouse
    const [hoveredItem, setHoveredItem] = useState(null);

    return (
        <div className='expenses-card'>
            <h2 className='card-title'>Gastos por categoria</h2>
            <DonutChart data={data} total={totalExpenses} hoveredItem={hoveredItem} setHoveredItem={setHoveredItem}/>
            <div className='legend-list'>
                {data.map((item) => (
                    <LegendItem key={item.id} item={item} hoveredItem={hoveredItem} setHoveredItem={setHoveredItem}/>
                ))}
            </div>
        </div>
    );
};

export default ExpensesCard;