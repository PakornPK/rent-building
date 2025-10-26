import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

// ===== Utility functions that compare by id =====
function not(a, b) {
    return a.filter((value) => !b.some((item) => item.id === value.id));
}

function intersection(a, b) {
    return a.filter((value) => b.some((item) => item.id === value.id));
}

export default function TransferList({
    dataLeft = [],
    dataRight = [],
    onQtyChange,
    onAppend,
    onRemove,
}) {
    const [checked, setChecked] = useState([]);
    const [left, setLeft] = useState([]);
    const [right, setRight] = useState([]);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);
    const [quantities, setQuantities] = useState({});

    const handleQuantityChange = (id, value) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: value,
        }));
        if (isNaN(id)) return;
        if (onQtyChange) onQtyChange(id, value);
    };
    useEffect(() => {
        if (Array.isArray(dataLeft)) setLeft(dataLeft);
        if (Array.isArray(dataRight)) setRight(dataRight);
    }, [dataLeft, dataRight]);

    const handleToggle = (value) => () => {
        const alreadyChecked = checked.some((v) => v.id === value.id);
        const newChecked = alreadyChecked
            ? checked.filter((v) => v.id !== value.id)
            : [...checked, value];

        setChecked(newChecked);
    };

    const handleAllRight = () => {
        setRight([...right, ...left]);
        setLeft([]);
    };

    // append
    const handleCheckedRight = async () => {
        setRight([...right, ...leftChecked]);
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
        const check = leftChecked.map(item => ({
            ...item,
            quantity: quantities[item.id] ?? item.quantity ?? 1,
        }));
        if (onAppend) await onAppend(check)
    };

    // remove
    const handleCheckedLeft = () => {
        setLeft([...left, ...rightChecked]);
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
        if (onRemove) onRemove(rightChecked)
    };

    const handleAllLeft = () => {
        setLeft([...left, ...right]);
        setRight([]);
    };

    const customList = (items) => (
        <Paper sx={{ width: 300, height: 230, overflow: 'auto' }}>
            <List dense component="div" role="list">
                {Array.isArray(items) &&
                    items.map((value) => {
                        const labelId = `transfer-list-item-${value.id}-label`;
                        const isChecked = checked.some((v) => v.id === value.id);
                        const qty = quantities[value.id] || value.quantity || 1;
                        return (
                            <ListItemButton
                                key={value.id}
                                role="listitem"
                                onClick={handleToggle(value)}
                            >
                                <ListItemIcon>
                                    <Checkbox
                                        checked={isChecked}
                                        tabIndex={-1}
                                        disableRipple
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    id={labelId}
                                    primary={value?.name || value}
                                />
                                <TextField
                                    type="number"
                                    size="small"
                                    value={qty}
                                    onChange={(e) =>
                                        handleQuantityChange(value.id, parseInt(e.target.value, 10))
                                    }
                                    sx={{ width: 60, ml: 1 }}
                                />
                            </ListItemButton>
                        );
                    })}
            </List>
        </Paper>
    );

    return (
        <Grid container spacing={2} sx={{ justifyContent: 'center', alignItems: 'center' }}>
            <Grid item>{customList(left)}</Grid>
            <Grid item>
                <Grid container direction="column" alignItems="center">
                    {/* <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleAllRight}
                        disabled={left.length === 0}
                    >
                        ≫
                    </Button> */}
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                    >
                        &gt;
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                    >
                        &lt;
                    </Button>
                    {/* <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleAllLeft}
                        disabled={right.length === 0}
                    >
                        ≪
                    </Button> */}
                </Grid>
            </Grid>
            <Grid item>{customList(right)}</Grid>
        </Grid>
    );
}
